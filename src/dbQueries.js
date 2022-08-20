const inquirer = require( 'inquirer' );
const questions = require( './questions' );
const getList = require( './getList' );
const createTable = require( './createTable' );

const allEmployeesQuery = 
    `SELECT 
    e.id, 
    CONCAT( e.first_name, \' \', e.last_name ) AS name,
    title, 
    CONCAT( \'$\', FORMAT( salary, 2 ) ) AS annual_salary, 
    CONCAT( m.first_name, \' \', m.last_name ) AS manager 
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


const getAndDisplayAll = async ( db, dataType ) => {
    const options = {
        emp: {
            query: allEmployeesQuery,
            title: 'Employees'
        },
        dept: {
            query: allDeptQuery,
            title: 'Departments'
        },
        role: {
            query: allRolesQuery,
            title: 'Roles'
        }
    }

    try {
        // query database for data
        const [ data ] = await db.execute( options[ dataType ].query );
        // create formatted table from data
        if ( !data.length ) {
            console.log( `No ${ options[ dataType ].title } Saved in Database` );
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

    updateEmployee: async ( db ) => {
        try {
            const  answers = await inquirer.prompt( await questions.updateEmployeeRole( db ) );

            const  { id, role_id }  = answers;
            await db.execute( 'UPDATE employee SET role_id = ? WHERE id = ?', [ role_id, id ] );
            const [[ updated ]] = await db.execute( 'SELECT CONCAT( first_name, \' \', last_name ) AS name, title from employee e JOIN role r ON e.role_id = r.id WHERE e.id = ?', [ id ] );
            console.log( '\n',`${ updated.name }'s Role has been updated to ${ updated.title }.`, '\n' );
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

    allEmployees: db => getAndDisplayAll( db, 'emp' ),
    allRoles: db => getAndDisplayAll( db, 'role' ),
    allDepartments: db => getAndDisplayAll( db, 'dept' ),
}





module.exports = { dbQueries };