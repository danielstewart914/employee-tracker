const inquirer = require( 'inquirer' );
const questions = require( './questions' );
const getList = require( './getList' );
const createTable = require( '../helpers/createTable' );
const logInfo = require( '../helpers/logInfo' );


// Database query strings for get and display all
const allEmployeesQuery = 
    `SELECT 
    e.id, 
    CONCAT( e.first_name, \' \', e.last_name ) AS name,
    IFNULL( r.title, \'No Role\' ) AS employee_role,
    CONCAT( \'$\', FORMAT( salary, 2 ) ) AS annual_salary, 
    IFNULL ( CONCAT( m.first_name, \' \', m.last_name ), \'None\' ) AS manager
    FROM employee e 
    LEFT JOIN employee m ON e.manager_id = m.id 
    LEFT JOIN role r ON e.role_id = r.id`;

const allDeptQuery =
    `SELECT * FROM department`;

const allRolesQuery = 
    `SELECT 
    r.id, 
    title, 
    CONCAT( \'$\', FORMAT( salary, 2 ) ) AS annual_salary, 
    name AS Department,
    IF ( manager_role, 'Yes', NULL ) supervisory_role
    FROM role r 
    JOIN department d ON r.department_id = d.id`;

const allManagerQuery = 
    `SELECT 
    e.id, 
    CONCAT( e.first_name, \' \', e.last_name ) AS name,
    title AS manager_role, 
    CONCAT( \'$\', FORMAT( salary, 2 ) ) AS annual_salary  
    FROM employee e  
    LEFT JOIN role r ON e.role_id = r.id 
    WHERE manager_role = true`;


// other long query strings
const employeeNameById = 
    `SELECT
    CONCAT( e.first_name, \' \', e.last_name ) AS name
    FROM employee e
    WHERE id = ?`;

const employeesByManagerQuery = 
    `SELECT 
    e.id, 
    CONCAT( e.first_name, \' \', e.last_name ) AS name,
    title AS employee_role
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id
    WHERE e.manager_id = ?`;

const deptBudgetQuery = 
    `SELECT 
	d.name AS department_name, 
	CONCAT( '$', FORMAT( IFNULL( SUM ( salary ), 0 ), 2 ) ) AS annual_utilized_budget 
    FROM employee e 
    JOIN role r ON e.role_id = r.id
    RIGHT JOIN department d ON r.department_id = d.id
    GROUP BY d.id`;

const roleAndEmpCountByDeptQuery = 
    `SELECT COUNT( r.id ) AS role_count, 
    COUNT( e.id ) AS employee_count,
    d.name AS name
    FROM employee e 
    RIGHT JOIN role r ON e.role_id = r.id 
    RIGHT JOIN department d ON r.department_id = d.id 
    WHERE d.id = ?`;

// get and display
const getAndDisplayAll = async ( db, dataType ) => {
    const options = {
        employees: {
            query: allEmployeesQuery,
            title: 'Employees'
        },
        departments: {
            query: allDeptQuery,
            title: 'Departments'
        },
        roles: {
            query: allRolesQuery,
            title: 'Roles'
        },
        managers: {
            query: allManagerQuery,
            title: 'Managers'
        }
    }

    try {
        // query database for data
        const [ data ] = await db.execute( options[ dataType ].query );
        if ( !data.length ) {
            // if none of selected data exists in Database log an alert
            logInfo.alert( `No ${ options[ dataType ].title } Saved in Database` );
            return;
        }

        // create formatted table from data
        const dataTable = createTable( options[ dataType ].title, data );

        // display table
        console.log( '\n' );
        dataTable.printTable();

    }
    catch ( error ) {
        console.error( error );
    }
}

// Database query object
const dbQueries = {

    addDepartment: async ( db ) => {
        try {
            // prompt for department name
            const { name } = await inquirer.prompt( questions.deptName );
            // insert into database
            await db.execute( 'INSERT INTO department ( name ) VALUES ( ? )', [ name ] );
            // log success
            logInfo.success( `${ name } has been added to Departments.` );
        }
        catch ( error ) {
            console.error( error );
        }
    },
    
    addEmployee: async ( db ) => {
        try {
            // check if there are roles to assign to employee
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM role' );
            if ( !count ) {
                logInfo.alert( 'You must have at least 1 Role before adding an Employee' );
                return;
            }

            // prompt for employee info
            const answers = await inquirer.prompt( await questions.employeeInfo( db ) );
            // get answers as an array of strings
            const employeeData = Object.values( answers );
            // insert into database
            await db.execute( 'INSERT INTO employee ( first_name, last_name, role_id, manager_id ) VALUES ( ?, ?, ?, ? )', employeeData );
            // log success
            logInfo.success( `${ answers.first_name } ${ answers.last_name } has been added to Employees.` );
        }
        catch ( error ) {
            console.error( error );
        }
    },

     employeesByManager: async ( db ) => {
        try {
            // count managers
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( e.id ) AS count FROM employee e JOIN role r ON e.role_id = r.id WHERE manager_role = true' );
            if( !count ) {
                // log an alert if there are none
                logInfo.alert( 'There are no Manager Roles assigned to any employees' );
                return;
            }
            
            // prompt for manager
            const { id } = await inquirer.prompt( await questions.select( db, 'Please Select a manager.', 'managers' ) );
            // select all employee that report to this manager
            const [ employees ] = await db.execute( employeesByManagerQuery, [ id ] );

            // get manager's name from Database for Table Title
            const [[ { name } ]] = await db.execute( employeeNameById, [ id ] );

            if ( !employees.length ) {
                // if no employee's are assigned to this manager log an alert
                logInfo.alert( `There are no employees assigned to ${ name }` );
                return;
            }

            // create table from list of employee's
            const employeeTable = createTable( `${ name }\'s Employees` , employees );

            // display table
            console.log( '\n' );
            employeeTable.printTable();

        }
        catch ( error ) {
            console.error( error );
        }
    },

    updateEmployeeRole: async ( db ) => {
        try {
            // check if any employees are saved in database
            const [[ { e_count } ]] = await db.execute( 'SELECT COUNT( id ) AS e_count FROM employee' );
            if ( !e_count ) {
                logInfo.alert( 'There are no Employees saved in Database.' );
                return;
            }
            // prompt user for employee to update
            const  { id } = await inquirer.prompt( await questions.select( db, 'Which Employee would you like to update?', 'employees' ) );
            
            // count employees that report to this employee/manager
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM employee WHERE manager_id = ?', [ id ] );
            if ( count ) {
                // if any employees report to this employee/manager log a danger message
                logInfo.danger( `This manager has ${ count } employees assigned to them.\nThis action will unassign the ${ count } employee(s) from reporting to a manager.` );
                // ask to confirm
                const { confirm } = await inquirer.prompt( questions.confirm( 'change this Employee\'s', 'Role' ) );

                if ( !confirm ) return;
                // set reporting employees manager_id to Null
                await db.execute( 'UPDATE employee SET manager_id = NULL WHERE manager_id = ?', [ id ] );
            }

            // prompt for new role
            const  role = await inquirer.prompt( await questions.select( db, 'Select a new Role for this employee', 'roles' ) );

            // set new role
            await db.execute( 'UPDATE employee SET role_id = ? WHERE id = ?', [ role.id, id ] );

            // show confirmation message
            const [[ updated ]] = await db.execute( 'SELECT CONCAT( first_name, \' \', last_name ) AS name, title from employee e JOIN role r ON e.role_id = r.id WHERE e.id = ?', [ id ] );
            logInfo.success( `${ updated.name }'s Role has been updated to ${ updated.title }.` );
        }
        catch ( error ) {
            console.error( error );
        }
    },

    updateEmployeeManager: async ( db ) => {
        try {
            // check if any employees are saved in database
            const [[ { e_count } ]] = await db.execute( 'SELECT COUNT( id ) AS e_count FROM employee' );
            if ( !e_count ) {
                logInfo.alert( 'There are no Employees saved in Database.' );
                return;
            }
            // check if any mangers are saved in database
            const [[ { count } ]] = await db.execute( `SELECT count ( e.id ) AS count FROM employee e JOIN role r ON e.role_id = r.id WHERE manager_role = true` );

            // if there are no managers alert user
            if ( !count ) {
            logInfo.alert( `No Managers Saved in Database. Please assign employees to Supervisory Roles` );
                return;
            }

            // prompt for employee to update
            const { id } = await inquirer.prompt( await questions.select( db, 'Which Employee would you like to update?', 'employees' ) );

            // prompt for new manager
            const { manager_id } = await inquirer.prompt( await questions.selectNewManager( db, id ) );

            // update and log success
            await db.execute( 'UPDATE employee SET manager_id = ? WHERE id = ?', [ manager_id, id ] );
            logInfo.success( 'Manager has been updated' );

            }
            catch ( error ) {
                console.error( error );
            }
    },

    deleteEmployee: async ( db ) => {
        try {
            // check if any employees are saved in database
            const [[ { e_count } ]] = await db.execute( 'SELECT COUNT( id ) AS e_count FROM employee' );
            if ( !e_count ) {
                logInfo.alert( 'There are no Employees saved in Database.' );
                return;
            }

            // prompt user for employee to delete
            const { id } = await inquirer.prompt( await questions.select( db, 'Which Employee would you like to delete?', 'employees' ) );
            // count the number of employees that report to selected employee
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM employee WHERE manager_id = ?', [ id ] );

            // if any employees report to this employee log a danger message
            if ( count ) {
            logInfo.danger( `This manager has ${ count } employees assigned to them.\nThis action will unassign the ${ count } employee(s) from reporting to a manager.` );  
            }

            // prompt for confirmation
            const { confirm } = await inquirer.prompt( questions.confirm( 'delete', 'Employee' ) );

            if ( !confirm ) return;
            
            // retrieve employee name
            const [[ { name }  ]] = await db.execute( `SELECT CONCAT( first_name, \' \', last_name ) AS name from employee WHERE id = ?`, [ id ] );
            // delete employee
            await db.execute( `DELETE FROM employee WHERE id = ?`, [ id ] );

            // display success message
            logInfo.success( `${ name } has been deleted.` );

        }
        catch ( error ) {
            console.error( error );
        }
    },

    addRole: async ( db ) => {
        try {
            // count departments
            const [[ { count } ]] = db.execute( 'SELECT COUNT( id ) AS count FROM department' );
            if( !count ) {
                // if there are no departments log an alert
                logInfo.alert( 'You must have at least 1 Department before adding a Role' );
                return;
            }
            // prompt for role info
            const answers = await inquirer.prompt( await questions.roleInfo( db ) );

            // convert object values to an array of data
            const roleData = Object.values( answers );

            // save new role with array of data
            await db.execute( 'INSERT INTO role ( title, salary, department_id, manager_role ) VALUES ( ?, ?, ?, ? )', roleData );

            // log success
            logInfo.success( `\'${ answers.title }\' has been added to Roles.` );
        }
        catch ( error ) {
            console.error( error );
        }
    },

    deleteRole: async ( db ) => {
        try {
            // count roles
            const [[ { r_count } ]] = await db.execute( 'SELECT COUNT( id ) AS r_count FROM role' );
            if ( !r_count ) {
                // log an alert if none exist
                logInfo.alert( 'No Roles saved in Database.' );
                return;
            }
            // prompt for role to delete
            const { id } = await inquirer.prompt( await questions.select( db, 'Which Role would you like to delete?', 'roles' ) );
            // count employees assign to this role
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM employee WHERE role_id = ?', [ id ] );
            if ( count ) {
                // log a danger message
                logInfo.danger( `Deleting this Role will effect ${ count } employees.` );
            }
            // prompt for confirmation
            const { confirm } = await inquirer.prompt( questions.confirm( 'delete', 'Role' ) );
                
            if ( !confirm ) return;
            // delete role
            await db.execute( 'DELETE FROM role WHERE id = ?', [ id ] );
            // log success
            logInfo.success( 'Role has been deleted' );
        }
        catch ( error ) {
            console.error( error );
        }
    },

    deleteDepartment: async ( db ) => {
        try {
            // count departments
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM department' );
            if ( !count ) {
                // log an alert if none exist
                logInfo.alert( 'No Departments saved in Database.' );
                return;
            }

            // prompt for department to delete
            const { id } = await inquirer.prompt( await questions.select( db, 'Which department would you like to delete?', 'dept' ) );
            // count roles and employees assign to this department
            const [[ { role_count, employee_count, name } ]] = await db.execute( roleAndEmpCountByDeptQuery, [ id ] );

            if ( role_count || employee_count ) {
                // log a danger message
                logInfo.danger( `Deleting this Department will also delete ${ role_count } Roles.\n Effecting ${ employee_count } employees assigned to those roles.` );
            }

            // prompt for confirmation
            const { confirm } = await inquirer.prompt( questions.confirm( 'delete', 'Department' ) );

            if ( !confirm ) return;

            // delete department
            await db.execute( 'DELETE FROM department WHERE id = ?', [ id ] );
            // update manager id of any effected employees
            await db.execute( 'UPDATE employee e JOIN employee m ON e.manager_id = m.id SET e.manager_id = NULL WHERE m.role_id IS NULL' );
            // log success
            logInfo.success( `The ${ name } department and related roles have been deleted` );
        }
        catch ( error ) {
            console.error( error );
        }
    },

    departmentBudget: async ( db ) => {
        try {
            // count departments
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM department' );
            if ( !count ) {
                // log an alert if none exist
                logInfo.alert( 'No Departments saved in Database.' );
                return;
            }

            // retrieve budget info from database
            const [ budgetData ] = await db.execute( deptBudgetQuery );

            // create table
            const budgetTable = createTable( 'Department Budgets', budgetData );

            // display table
            console.log( '\n' );
            budgetTable.printTable();
        }
        catch ( error ) {
            console.error( error );
        }
    },

    allEmployees: db => getAndDisplayAll( db, 'employees' ),
    allRoles: db => getAndDisplayAll( db, 'roles' ),
    allDepartments: db => getAndDisplayAll( db, 'departments' ),
    allManagers: db => getAndDisplayAll( db, 'managers' ),

}

module.exports = { dbQueries };