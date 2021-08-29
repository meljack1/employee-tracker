class Queries {
    constructor(db) {
        this.db = db;
    }

    viewDepartments() {   
        this.db.query('SELECT * FROM department;', function (err, result) {
            console.log(`\n`);
            console.table(result);
            console.log(`\n`);
        }); 
    }

    viewRoles() {
        this.db.query('SELECT * FROM role', function (err, result) {
            console.log(`\n`);
            console.table(result);
            console.log(`\n`);
        }); 
    }

    viewEmployees() {
        this.db.query('SELECT * FROM employee', function (err, result) {
            console.log(`\n`);
            console.table(result);
            console.log(`\n`);
        }); 
    }

    addDepartment() {
        this.db.query('INSERT INTO department(name)', function (err, result) {
            console.table(result);
        }); 
    }
}

module.exports = Queries;
  