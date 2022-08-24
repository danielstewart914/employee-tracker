# Employee Tracker - [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Description
 A Simple CMS application for interacting with an employee database<br>
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)
- [License](#license)
- [Technology](#technology)
- [Questions](#questions)

## Installation

Make sure you have node.js V16 or higher installed. 

If not you can download it here - [![Node.js](https://img.shields.io/badge/Node.js%20Home%20Page-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)

Also be sure to have MySQL installed and setup.

If not you can download it here - [![Node.js](https://img.shields.io/badge/MySQL%20Dowload%20Page-005C84?logo=mysql&logoColor=white)](https://dev.mysql.com/downloads/mysql/)

1. Clone the repository files to your computer
2. Using a CLI navigate to the folder where you have copied the application files
3. Run command `npm install` to install dependencies required for application usage
4. Add a new  `.env` file to the folder where this application is installed
5. In a text editor of your choice edit the contents of the `.env` file to contain `DB_PASS='password'` where 'password' is replaced with your root database password.
6. Open the mySQL Shell in the directory where you installed this application and run `SOURCE db/schema.sql` to initialize the employee Database. 

Note: Only source the `schema.sql` file once when setting up the database for the first time. Running the schema file again after interacting with the database will irreversibly erase all records contained in the Database.
## Usage

[Click here for a Walkthrough Video](https://youtu.be/3xTmTekaNEo)

1. Using a CLI navigate to the folder where you have saved the application.
2. Run command `node index.js` to start the application.
3. Select the operation you would like to accomplish from the main menu and follow all prompt you are given.
4. You will be returned to the main menu and can select another task or exit the application.
## License

<p>
MIT License

Copyright 2022 &copy; Daniel Stewart

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</p>

## Technology

### Languages

- [![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://www.javascript.com/)

### Runtime

- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)

### Packages

- [![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
- [![Inquirer](https://img.shields.io/badge/inquirer-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/inquirer)
- [![MySQL2](https://img.shields.io/badge/MySQL2-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/mysql2)
- [![dotENV](https://img.shields.io/badge/dotenv-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/dotenv)
- [![Console-Table-Printer](https://img.shields.io/badge/console%20table%20printer-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/console-table-printer)
- [![Chalk](https://img.shields.io/badge/chalk-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/chalk/v/4.1.0)


## Database

- [![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

## Questions 

If you have any questions or feedback you can contact me through one of the links below <br>
GitHub Profile - [danielstewart914](https://github.com/danielstewart914)<br>
Email - [danielstewart914@outlook.com](mailto:danielstewart914@outlook.com)
