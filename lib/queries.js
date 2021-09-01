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
        this.db.query('SELECT title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;', function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    viewEmployees(func) {
        this.db.query('SELECT employee.id, first_name, last_name, role.title AS title, role.salary AS salary, manager_id FROM employee JOIN role ON employee.role_id = role.id;', function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    viewByManager(manager, func) {
        this.db.query(`SELECT employee.id, first_name, last_name, role.title AS title, role.salary AS salary, manager_id FROM employee JOIN role ON employee.role_id = role.id WHERE manager_id = ${manager};`, function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    viewByDepartment(department, func) {
        this.db.query(`SELECT employee.id, first_name, last_name, role.title AS title, role.salary AS salary, manager_id FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ${department};`, function (err, result) {
            console.log(`\n`);
            console.table(result);
            func();
        }); 
    }

    addDepartment(name, func) {
        this.db.query(`INSERT INTO department(name) VALUES ("${name}");`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Database updated with new department.`);
            }
            func();
        }); 
    }

    addRole(title, salary, department, func) {
        this.db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${department});`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Database updated with new role.`)
            }
            func();
        }); 
    }

    addEmployee(firstName, lastName, role, manager, func) {
        this.db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${role}, ${manager});`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Database updated with new employee.`)
            }
            func();
        }); 
    }

    updateEmployeeRole(id, role, func) {
        this.db.query(`UPDATE employee SET role_id = ${role} WHERE id = ${id};`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Employee records updated.`)
            }
            func();
        }); 
    }

    updateEmployeeManager(id, manager, func) {
        this.db.query(`UPDATE employee SET manager_id = ${manager} WHERE id = ${id};`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Employee records updated.`)
            }
            func();
        }); 
    }

    deleteDepartment(department, func) {
        this.db.query(`DELETE FROM department WHERE id = ${department}`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Department deleted.`)
            }
            func();
        }); 
    }

    deleteRole(role, func) {
        this.db.query(`DELETE FROM role WHERE id = ${role}`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Role deleted.`)
            }
            func();
        }); 
    }

    deleteEmployee(employee, func) {
        this.db.query(`DELETE FROM employee WHERE id = ${employee}`, function (err, result) {
            if (err) {
                console.error(err)
            } else {
                console.log(`Employee deleted.`)
            }
            func();
        }); 
    }

    // Creates an array of choices for inquirer as an object with a name to display in inquirer, and a value to save
    // For departments: 
    async getDepartmentChoices() {
        const [data] = await this.db.promise()
            .query('SELECT id, name FROM department;');
        const departmentChoices = data.map(result => { return {name: result.name, value: result.id} })
        return departmentChoices;
    }

    // For roles:
    async getRoleChoices() {
        const [data] = await this.db.promise()
            .query('SELECT id, title FROM role;');
        const roleChoices = data.map(result => { return {name: result.title, value: result.id} })
        return roleChoices;
    }

    // For employees/managers:
    async getEmployeeChoices() {
        const [data] = await this.db.promise()
            .query('SELECT id, first_name, last_name FROM employee;');
        const managerChoices = data.map(result => { return {name: `${result.first_name} ${result.last_name}`, value: result.id} })
        return managerChoices;
    }
}

module.exports = Queries;
  