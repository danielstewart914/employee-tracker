const getList = require( './getList' );

const questions = {

    mainMenuQuestions: {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [ 
            {
                name: 'View all Employees',
                value: 'allEmployees'
            },
            {
                name: 'View all Managers',
                value: 'allManagers'
            },
            {
                name: 'Add Employee',
                value: 'addEmployee'
            },
            {
                name: 'Update Employee Role',
                value: 'updateEmployeeRole'
            },
            {
                name: 'Delete Employee',
                value: 'deleteEmployee'
            },
            {
                name: 'View all Roles',
                value: 'allRoles'
            },
            {
                name: 'Add Role',
                value: 'addRole'
            },
            {
                name: 'Delete Role',
                value: 'deleteRole'
            },
            {
                name: 'View all Departments',
                value: 'allDepartments'
            },
            {
                name: 'Add Department',
                value: 'addDepartment'
            },
            {
                name: 'Exit Application',
                value: 'exit'
            }
        ],
        default: 0,
        loop: false
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
                choices: await getList.roles( db ),
                loop: false
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is this Employee\'s Manger?',
                choices: await getList.managers( db, true ),
                loop: false
            }
         ];
    
         return questions;
    },

    updateEmployeeRole: async ( db ) => {
        const questions = [
            {
                type: 'list',
                name: 'id',
                message: 'Which Employee would you like to update?',
                choices: await getList.employees( db ),
                loop: false
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Please select a new Role for this Employee.',
                choices: await getList.roles( db ),
                loop: false
            }
        ]
        return questions;
    },

    deleteEmployee: async ( db ) => {
        const questions = [
            {
                type: 'list',
                name: 'id',
                message: 'Which Employee would you like to delete?',
                choices: await getList.employees( db ),
                loop:false
            },
            {
                type: 'list',
                name: 'confirm',
                message: 'Are you sure you want to delete this Employee?',
                choices: [ { name: 'Yes', value: true }, { name: 'No', value: false } ]
            }
        ]

        return questions;
    },

    roleInfo: async ( db ) => {
        const questions = [
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of this Role?',
                validate: input => {
                    if ( !input ) return 'Cannot be blank!';
                    return true;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this Role?',
                validate: input => {
                    const salaryRegEx = /^[$]?[\d,]+$/;
                    if ( !salaryRegEx.test( input ) ) return 'That is not a valid salary!';
                    return true;
                },
                filter: input => {
                    const salaryIntString = input.replaceAll( '$', '' ).replaceAll( ',', '' );
                    return parseInt( salaryIntString );
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What Department does this Role belong to?',
                choices: await getList.dept( db ),
                loop: false
            },
            {
                type: 'list',
                name: 'manager_role',
                message: 'Is this Role a managerial position?',
                choices: [ { name: 'Yes', value: true }, { name: 'No', value: false } ]
            }

        ]

        return questions;
    },

    deleteRole: async ( db ) =>{
        return [
            {
                type: 'list',
                name: 'id',
                message: 'Which Role would you like to delete?',
                choices: await getList.roles( db ),
                loop: false
            }
        ]
    },

    confirmDeleteRole: {
        type: 'list',
        name: 'confirm',
        message: 'Are you sure you want to delete this Role?',
        choices: [ { name: 'Yes', value: true }, { name: 'No', value: false } ]
    }
}

module.exports = questions; 