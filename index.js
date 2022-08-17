require( 'dotenv' ).config();

const inquirer = require( 'inquirer' );
const mysql = require( 'mysql2/promise' );
const { mainMenuQuestions } = require( './src/questions' );

const init = async () => {
    try {
        const db = await mysql.createConnection (
            {
                host: 'localhost',
                user: 'root',
                password: process.env.DB_PASS,
                database: 'employees_db'
            }
        );
    
        console.log( 'Connected to employee database' );

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

    }

    catch ( error ) {
        console.error( error );
    }
}

init();