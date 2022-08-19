const { getRoleChoice, getManagerChoice } = require("./db-queries");

const mainMenuQuestions = {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [ 
        {
            name: 'View all Employees',
            value: 'all-emp'
        },
        {
            name: 'Add Employee',
            value: 'add-emp'
        },
        {
            name: 'View all Roles',
            value: 'all-role'
        },
        {
            name: 'Add Role',
            value: 'add-role'
        },
        {
            name: 'View all Departments',
            value: 'all-dept'
        },
        {
            name: 'Add Department',
            value: 'add-dept'
        },
        {
            name: 'Exit Application',
            value: 'exit'
        }
    ],
    default: 0
};

const forDeptName = {
    type: 'input',
    name: 'name',
    message: 'Please enter a name for the Department:',
    validate: input => {
        if ( !input ) return 'Cannot be blank!';
        return true;
    }
}

const forEmployeeInfo = async ( db ) => {
    const questions = [ 
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the Employee\'s First Name?',
            validate: input => {
                if ( !input ) return 'Cannot be blank!';
                return true;
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the Employee\'s Last Name?',
            validate: input => {
                if ( !input ) return 'Cannot be blank!';
                return true;
            }
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Please select a Role for this Employee',
            choices: await getRoleChoice( db )
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is this Employee\'s Manger?',
            choices: await getManagerChoice( db )
        }
     ];

     return questions;
} 

module.exports = { mainMenuQuestions, forDeptName, forEmployeeInfo }; 