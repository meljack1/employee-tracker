const cTable = require('console.table');

class Queries {
    constructor(db) {
        this.db = db;
    }

    viewDepartments(func) {   
        this.db.query('SELECT * FROM department;', function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    viewRoles(func) {
        this.db.query('SELECT * FROM role', function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    viewEmployees(func) {
        this.db.query('SELECT * FROM employee', function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    addDepartment(name, func) {
        this.db.query(`INSERT INTO department(name) VALUES ("${name}");`, function (err, result) {
            console.log(`Database updated with new department.`)
            func();
        }); 
    }

    addRole(title, salary, department, func) {
        this.db.query(`INSERT INTO role (title, salary, department_id) VALUES (${title}, ${salary}, ${department});`, function (err, result) {
            console.log(`Database updated with new role.`)
            func();
        }); 
    }

    addEmployee(firstName, lastName, role, manager, func) {
        this.db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${firstName}, ${lastName}, ${role}, ${manager});`, function (err, result) {
            console.log(`Database updated with new employee.`)
            func();
        }); 
    }

    getDepartmentChoices() {
        this.db.query('SELECT name FROM department;', function (err, result) {
            console.log(result);
        })
    }
}

module.exports = Queries;
  