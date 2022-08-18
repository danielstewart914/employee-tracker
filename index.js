// .env for keeping db password hidden
require( 'dotenv' ).config();

const { getAllEmployees, getAllDept, getAllRoles } = require( './src/db-queries' );
const inquirer = require( 'inquirer' );
const mysql = require( 'mysql2/promise' );
const { mainMenuQuestions } = require( './src/questions' );

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
                
            break;
            case 'all-dept':
                await getAllDept( db );
                mainMenu();
            break;
            case 'all-emp': 
                await getAllEmployees( db );
                mainMenu();
            break;
            case 'all-role': 
                await getAllRoles( db );
                mainMenu();
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