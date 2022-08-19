// .env for keeping db password hidden
require( 'dotenv' ).config();

const { getAndDisplayAll,
        getManagerChoice, 
        getDeptChoice, 
        getRoleChoice,
        addDept,
        addEmployee 
    } = require( './src/db-queries' );

const inquirer = require( 'inquirer' );
const mysql = require( 'mysql2/promise' );
const { mainMenuQuestions, forDeptName, forEmployeeInfo } = require( './src/questions' );

let db;

const init = async () => {
    try {
        const connection = await mysql.createConnection (
            {
                host: 'localhost',
                user: 'root',
                password: process.env.DB_PASS,
                database: 'employees_db'
            }
        );
    
        console.log( 'Connected to employee database' );
        db = connection;

        mainMenu();
    }

    catch {
        console.log( 'Connection failed!' );
    }
}

const mainMenu = async () => {
    try {
        const answer = await inquirer.prompt( mainMenuQuestions );
        const { choice } = answer;

        switch( choice ) {
            case 'add-dept':
                try {
                    const { name } = await inquirer.prompt( forDeptName );
                    await addDept( db, name );
                    console.log( `\'${ name }\' Has been added to Departments.`, '\n' );
                    mainMenu();
                }
                catch ( error ) {
                    console.error( error );
                }
            break;
            case 'all-dept':
                try {
                    await getAndDisplayAll( db, 'departments' );
                    mainMenu();
                }
                catch ( error ) {
                    console.error( error );
                }
            break;
            case 'add-emp':
                try {
                    const answers = await inquirer.prompt( await forEmployeeInfo( db ) );
                    const employee = Object.values( answers );
                    await addEmployee( db, employee );
                    console.log( 'Employee has been added.', '\n' );
                    mainMenu();
                }
                catch ( error ) {
                    console.error( error );
                }
            break;
            case 'all-emp': 
                try {
                    await getAndDisplayAll( db, 'employees' );
                    mainMenu();
                    
                }
                catch ( error ) {
                    console.error( error );
                }
            break;
            case 'all-role': 
                try {
                    await getAndDisplayAll( db, 'roles' );
                    mainMenu();
                }
                catch ( error ) {
                    console.error( error );
                }
            break;
            case 'exit':
                db.end();
            break;
            default:
                console.log( 'Bad selection' );
        }

    }

    catch ( error ) {
        console.error( error );
    }
}

init();