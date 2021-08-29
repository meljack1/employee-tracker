require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
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
    }
  ])
    .then((response) => {
      switch (response.action) {
        case "View all departments": 
          queries.viewDepartments(chooseAction);
          break;
        case "View all roles":
          queries.viewRoles(chooseAction);
          break;
        case "View all employees":
          queries.viewEmployees(chooseAction);
          chooseAction();
          break;
        case "Add a department":
          getDepartmentInfo();
          break;
        case "Add a role":
          getRoleInfo();
          break;
        default: 
          db.end();
      }
  });
}

function getDepartmentInfo() {
  inquirer
    .prompt([
    {
      type: 'input',
      message: "What do you want to call the new department?",
      name: 'name',
    },
  ])
    .then((response) => {
      queries.addDepartment(response.name, chooseAction);
  });
}

function getRoleInfo() {
  inquirer
    .prompt([
    {
      type: 'input',
      message: "What do you want to call the new role?",
      name: 'title',
    },
    {
      type: 'input',
      message: "What is the new role's salary?",
      name: 'salary',
    },
    {
      type: 'list',
      message: "Which department is the new role part of?",
      choices: queries.getDepartmentChoices(),
      name: 'department',
    },
  ])
    .then((response) => {
      console.log(response.department, response.department.id)
      queries.addRole(response.title, response.salary, response.department, chooseAction);
  });
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

chooseAction();