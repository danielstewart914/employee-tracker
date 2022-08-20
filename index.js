// .env for keeping db password hidden
require( 'dotenv' ).config();

const { dbQueries } = require( './src/dbQueries' );

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

        // if choice is exit disconnect database and return from function
        if ( choice === 'exit' ) {
            db.end();
            return;  
        } 

        // query 
        await dbQueries[choice]( db );
        mainMenu();
    }

    catch ( error ) {
        console.error( error );
    }
}

init();