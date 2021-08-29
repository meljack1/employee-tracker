class Queries {
    constructor(db) {
        this.db = db;
    }

    viewDepartments() {
        this.db.query('SELECT * FROM department', function (err, result) {
            console.table(result);
        }); 
    }

    viewRoles() {
        this.db.query('SELECT * FROM role', function (err, result) {
            console.table(result);
        }); 
    }

    viewEmployees() {
        this.db.query('SELECT * FROM employee', function (err, result) {
            console.table(result);
        }); 
    }
}

module.exports = Queries;
  