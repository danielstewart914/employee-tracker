const getList = require( './getList' );

const questions = {

    mainMenuQuestions: {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [ 
            {
                name: 'View all Employees',
                value: 'allEmp'
            },
            {
                name: 'Add Employee',
                value: 'addEmp'
            },
            {
                name: 'View all Roles',
                value: 'allRole'
            },
            {
                name: 'Add Role',
                value: 'addRole'
            },
            {
                name: 'View all Departments',
                value: 'allDept'
            },
            {
                name: 'Add Department',
                value: 'addDept'
            },
            {
                name: 'Exit Application',
                value: 'exit'
            }
        ],
        default: 0
    },
    
    deptName: {
        type: 'input',
        name: 'name',
        message: 'Please enter a name for the Department:',
        validate: input => {
            if ( !input ) return 'Cannot be blank!';
            return true;
        }
    },

    employeeInfo: async ( db ) => {
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
                choices: await getList.roles( db )
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is this Employee\'s Manger?',
                choices: await getList.managers( db )
            }
         ];
    
         return questions;
    } 
}

module.exports = questions; 