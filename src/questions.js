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

module.exports = { mainMenuQuestions }; 