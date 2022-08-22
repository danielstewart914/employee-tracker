const inquirer = require( 'inquirer' );
const questions = require( './questions' );
const getList = require( './getList' );
const createTable = require( './createTable' );


// Database query strings for get and display all
const allEmployeesQuery = 
    `SELECT 
    e.id, 
    CONCAT( e.first_name, \' \', e.last_name ) AS name,
    title, 
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
    title, 
    CONCAT( \'$\', FORMAT( salary, 2 ) ) AS annual_salary  
    FROM employee e  
    LEFT JOIN role r ON e.role_id = r.id 
    WHERE manager_role = true`;

const employeeNameById = 
    `SELECT
    CONCAT( e.first_name, \' \', e.last_name ) AS name
    FROM employee e
    WHERE id = ?`;

const employeesByManagerQuery = 
    `SELECT 
    e.id, 
    CONCAT( e.first_name, \' \', e.last_name ) AS name,
    title 
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id
    WHERE e.manager_id = ?`;

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
        // create formatted table from data
        if ( !data.length ) {
            console.log( '\n', `No ${ options[ dataType ].title } Saved in Database`, '\n' );
            return;
        }

        const dataTable = createTable( options[ dataType ].title, data );

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
            console.log( '\n',`\'${ name }\' has been added to Departments.`, '\n' );
        }
        catch ( error ) {
            console.error( error );
        }
    },
    
    addEmployee: async ( db ) => {
        try {
            // check if there are roles to assign to employee
            const roles = await getList.roles( db );
            if ( !roles.length  ) {
                console.log( 'You must have at least 1 Role before adding an Employee' );
                return;
            }

            // prompt for employee info
            const answers = await inquirer.prompt( await questions.employeeInfo( db ) );
            // get answers as an array of strings
            const employeeData = Object.values( answers );
            // insert into database
            await db.execute( 'INSERT INTO employee ( first_name, last_name, role_id, manager_id ) VALUES ( ?, ?, ?, ? )', employeeData );
            // log success
            console.log( '\n',`\'${ answers.first_name } ${ answers.last_name }\' has been added to Employees.`, '\n' );
        }
        catch ( error ) {
            console.error( error );
        }
    },

     employeesByManager: async ( db ) => {
        try {
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( e.id ) AS count FROM employee e JOIN role r ON e.role_id = r.id WHERE manager_role = true' );
    
            if( !count ) {
                console.log( '\n', 'There are no Manager Roles assigned to any employees', '\n' );
                return;
            }
    
            const { id } = await inquirer.prompt( await questions.employeesByManager( db ) );
            const [ employees ] = await db.execute( employeesByManagerQuery, [ id ] );

            const [[ { name } ]] = await db.execute( employeeNameById, [ id ] );

            if ( !employees.length ) {
                console.log( '\n', `There are no employees assigned to ${ name }`, '\n' );
                return;
            }

            const employeeTable = createTable( `${ name }\'s Employees` , employees );

            console.log( '\n' );
            employeeTable.printTable();

        }
        catch ( error ) {
            console.error( error );
        }
    },

    updateEmployeeRole: async ( db ) => {
        try {
            // prompt user for employee and new role
            const  { id } = await inquirer.prompt( await questions.selectEmployeeToUpdate( db ) );
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM employee WHERE manager_id = ?', [ id ] );

            if ( count ) {
                console.log( `This manager has ${ count } employees assign to them. This action will unassign these ${ count } employees` );
                const { confirm } = await inquirer.prompt( await questions.confirm( 'change this Employee\'s', 'Role' ) );

                if ( !confirm ) return;

                await db.execute( 'UPDATE employee SET manager_id = NULL WHERE manager_id = ?', [ id ] );
            }

            const { role_id } = await inquirer.prompt( await questions.selectNewRole( db ) );

            // set new role
            await db.execute( 'UPDATE employee SET role_id = ? WHERE id = ?', [ role_id, id ] );

            // show confirmation message
            const [[ updated ]] = await db.execute( 'SELECT CONCAT( first_name, \' \', last_name ) AS name, title from employee e JOIN role r ON e.role_id = r.id WHERE e.id = ?', [ id ] );
            console.log( '\n',`${ updated.name }'s Role has been updated to ${ updated.title }.`, '\n' );
        }
        catch ( error ) {
            console.error( error );
        }
    },

    deleteEmployee: async ( db ) => {
        try {
            // query user for employee and a confirmation
            const { id, confirm } = await inquirer.prompt( await questions.deleteEmployee( db ) );
        
            // if confirmation is negative return
            if ( !confirm ) return;
            
            // retrieve employee name
            const [[ { name }  ]] = await db.execute( `SELECT CONCAT( first_name, \' \', last_name ) AS name from employee WHERE id = ?`, [ id ] );
            // delete employee
            await db.execute( `DELETE FROM employee WHERE id = ?`, [ id ] );

            // display success message
            console.log( '\n',`${ name } has been deleted.`, '\n' );

        }
        catch ( error ) {
            console.error( error );
        }
    },

    addRole: async ( db ) => {
        try {
            const dept = await getList.dept( db );
            if( !dept.length ) {
                console.log( 'You must have at least 1 Department before adding a Role' );
                return;
            }

            const answers = await inquirer.prompt( await questions.roleInfo( db ) );

            const roleData = Object.values( answers );

            await db.execute( 'INSERT INTO role ( title, salary, department_id, manager_role ) VALUES ( ?, ?, ?, ? )', roleData );

            console.log( '\n',`\'${ answers.title }\' has been added to Roles.`, '\n' );
        }
        catch ( error ) {
            console.error( error );
        }
    },

    deleteRole: async ( db ) => {
        try {
            const { id } = await inquirer.prompt( await questions.deleteRole( db ) );
            const [[ { count } ]] = await db.execute( 'SELECT COUNT( id ) AS count FROM employee WHERE role_id = ?', [ id ] );
            if ( count ) {

                console.log( `Deleting this Role will effect ${ count } employees.` );

                const { confirm } = await inquirer.prompt( questions.confirm( 'delete', 'Role' ) );
                
                if ( !confirm ) return;
            }
            
            await db.execute( 'DELETE FROM role WHERE id = ?', [ id ] );
            console.log( 'Role has been deleted' );
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