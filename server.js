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
          break;
        case "Add a department":
          getDepartmentInfo();
          break;
        case "Add a role":
          getRoleInfo();
          break;
        case "Add an employee":
          getEmployeeInfo();
          break;
        case "Update an employee role":
          getUpdatedEmployeeInfo();
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

async function getRoleInfo() {
  const departmentChoices = await queries.getDepartmentChoices();
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
      choices: departmentChoices,
      name: 'department',
    },
  ])
    .then((response) => {
      queries.addRole(response.title, response.salary, response.department, chooseAction);
  });
}

async function getEmployeeInfo() {
  const roleChoices = await queries.getRoleChoices();
  const managerChoices = await queries.getEmployeeChoices();
  inquirer
    .prompt([
    {
      type: 'input',
      message: "What is the new employee's first name?",
      name: 'firstName',
    },
    {
      type: 'input',
      message: "What is the new employee's last name?",
      name: 'lastName',
    },
    {
      type: 'list',
      message: "What is the new employee's role?",
      choices: roleChoices,
      name: 'role',
    },
    {
      type: 'list',
      message: "What is the new employee's manager?",
      choices: managerChoices,
      name: 'manager',
    },
  ])
    .then((response) => {
      queries.addEmployee(response.firstName, response.lastName, response.role, response.manager, chooseAction);
  });
}

async function getUpdatedEmployeeInfo() {
  const roleChoices = await queries.getRoleChoices();
  const employeeChoices = await queries.getEmployeeChoices();
  inquirer
    .prompt([
    {
      type: 'list',
      message: "Which employee would you like to update the role of?",
      choices: employeeChoices,
      name: 'employee',
    },
    {
      type: 'list',
      message: "What would you like the employee's new role to be?",
      choices: roleChoices,
      name: 'role',
    },
  ])
    .then((response) => {
      queries.updateEmployee(response.employee, response.role, chooseAction);
  });
}

app.use((req, res) => {
  res.status(404).end();
});

chooseAction();