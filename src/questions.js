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
                name: 'View Employees by Manager',
                value: 'employeesByManager'
            },
            {
                name: 'View all Managers',
                value: 'allManagers'
            },
            {
                name: 'View all Roles',
                value: 'allRoles'
            },
            {
                name: 'View all Departments',
                value: 'allDepartments'
            },
            {
                name: 'View Department Budgets',
                value: 'departmentBudget'
            },
            {
                name: 'Add Employee',
                value: 'addEmployee'
            },
            {
                name: 'Add Role',
                value: 'addRole'
            },
            {
                name: 'Add Department',
                value: 'addDepartment'
            },
            {
                name: 'Update Employee Role',
                value: 'updateEmployeeRole'
            },
            {
                name: 'Update Employee Manager',
                value: 'updateEmployeeManager'
            },
            {
                name: 'Delete Employee',
                value: 'deleteEmployee'
            },
            {
                name: 'Delete Role',
                value: 'deleteRole'
            },
            {
                name: 'Delete Department',
                value: 'deleteDepartment'
            },
            {
                name: 'Exit Application',
                value: 'exit'
            }
        ],
        default: 0,
        loop: false
    },

    confirm: ( action, info ) => {
        return [
            {
                type: 'list',
                name: 'confirm',
                message: `Are you sure you want to ${ action } this ${ info }?`,
                choices: [ { name: 'Yes', value: true }, { name: 'No', value: false } ]
            }
        ]
        
        
    },

    select: async ( db, message, list ) => {
        return [
            {
                type: 'list',
                name: 'id',
                message: message,
                choices: await getList[list]( db ),
                loop: false
            }
        ]
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
        return [ 
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

    selectNewManager: async ( db, id ) => {
        return [
            {
                type: 'list',
                name: 'manager_id',
                message: 'Please select this Employee\'s new Manger?',
                choices: await getList.managers( db, true, id ),
                loop: false
            }
        ]
    }
}

module.exports = questions; 