require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const Queries = require('./lib/queries.js');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // Put your local password here
    password: '',
    database: 'employees_db',
  },
  console.log(`Connected to the database.`)
);

const queries = new Queries(db);

function chooseAction() {
  inquirer
    .prompt([
    {
      type: 'list',
      message: "What would you like to do?",
      choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"],
      name: 'action',
    },
    {
      type: 'input',
      message: "What do you want to call the new department?",
      when: (response) => response.action === "Add a department",
      name: 'departmentName',
    }
  ])
    .then((response) => {
      switch (response.action) {
        case "View all departments": 
          queries.viewDepartments();
          chooseAction();
          break;
        case "View all roles":
          queries.viewRoles();
          chooseAction();
          break;
        case "View all employees":
          queries.viewEmployees();
          chooseAction();
          break;
      }
  });
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

chooseAction();