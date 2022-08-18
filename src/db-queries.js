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


const getAllEmployees = async ( db ) => {

    const [ employees ] = await db.execute( allEmployeesQuery );
    const employeeTable = createTable( 'All Employees', employees );
    console.log( '\n' );
    employeeTable.printTable();
    console.log( '\n' );
}

const getAllDept = async ( db ) => {
    const [ departments ] = await db.execute( allDeptQuery );
    const deptTable = createTable( 'All Departments', departments );
    console.log( '\n' );
    deptTable.printTable();
    console.log( '\n' );
}

const getAllRoles = async ( db ) => {
    const [ roles ] = await db.execute( allRolesQuery );
    const roleTable = createTable( 'All Roles', roles );
    console.log( '\n' );
    roleTable.printTable();
    console.log( '\n' );
}

module.exports = { getAllEmployees, getAllDept, getAllRoles };