const inquirer = require( 'inquirer' );
const questions = require( './questions' );
const getList = require( './getList' );
const createTable = require( './createTable' );

const allEmployeesQuery = 
    `SELECT 
    e.id, 
    e.first_name, 
    e.last_name, 
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

    addDept: async ( db ) => {
        try {
            // prompt for department name
            const { name } = await inquirer.prompt( questions.deptName );
            // insert into database
            await db.execute( 'INSERT INTO department ( name ) VALUES ( ? )', [ name ] );
            // log success
            console.log( `\'${ name }\' Has been added to Departments.`, '\n' );
        }
        catch ( error ) {
            console.error( error );
        }
    },
    
    addEmp: async ( db ) => {
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
            console.log( `Employee: \'${ answers.first_name } ${ answers.last_name }\' has been added.`, '\n' );
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

            console.log( `Role: \'${ answers.title }\' has been added.` )
        }
        catch ( error ) {
            console.error( error );
        }
    },

    allEmp: db => getAndDisplayAll( db, 'emp' ),
    allRole: db => getAndDisplayAll( db, 'role' ),
    allDept: db => getAndDisplayAll( db, 'dept' ),
}





module.exports = { dbQueries };