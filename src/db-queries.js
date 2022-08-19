const { printTable } = require('console-table-printer');
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
    name AS Department 
    FROM role r 
    JOIN department d ON r.department_id = d.id`;

const getAndDisplayAll = async ( db, dataType ) => {
    let query;
    let title;

    switch ( dataType ) {
        case 'employees':
            query = allEmployeesQuery;
            title = 'All Employees';
        break;
        case 'departments':
            query = allDeptQuery;
            title = 'All Departments';
        break;
        case 'roles':
            query = allRolesQuery;
            title = 'All Roles';
        break;
        default:
            console.error( 'Invalid type' );
    }

    try {
        const [ data ] = await db.execute( query );
        const dataTable = createTable( title, data );

        console.log( '\n' );
        dataTable.printTable();
    }
    catch ( error ) {
        console.error( error );
    }
}

const getManagerChoice = async ( db ) => {
    try {
        const [ result ] = await db.execute( 'SELECT e.id AS value, CONCAT( first_name, \' \', last_name ) AS name FROM employee e JOIN role r ON e.role_id = r.id WHERE manager_role = true' );
        // add option for no manager
        result.push( { name: 'None', value: null } );
        return result;
    }
    catch ( error ) {
        console.error( error );
    }
}

const getDeptChoice = async ( db ) => {
    try {
        const [ result ] = await db.execute( 'SELECT id AS value, name FROM department' );
        return result;
    }
    catch ( error ) {
        console.error( error );
    }
}


const getRoleChoice = async ( db ) => {
    try {
        const [ result ] = await db.execute( 'SELECT id AS value, title AS name FROM role' );
        return result;
    }
    catch ( error ) {
        console.error( error );
    }
}

const addDept = async ( db, name ) => {
    try {
        return await db.execute( 'INSERT INTO department ( name ) VALUES ( ? )', [ name ] );
    }
    catch ( error ) {
        console.error( error );
    }
}

const addEmployee = async ( db, employeeData ) => {
    try {
        return await db.execute( 'INSERT INTO employee ( first_name, last_name, role_id, manager_id ) VALUES ( ?, ?, ?, ? )', employeeData );
    }
    catch ( error ) {
        console.error( error );
    }
}

module.exports = { getAndDisplayAll, getManagerChoice, getDeptChoice, getRoleChoice, addDept, addEmployee };