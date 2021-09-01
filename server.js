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
    // Put your MySQL password between the quotation marks below:
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
      choices: [
        "View all departments", 
        "View all roles", 
        "View all employees", 
        "View employees by manager",
        "Add a department", 
        "Add a role", 
        "Add an employee", 
        "Update an employee role", 
        "Update an employee manager",
        "Quit"
      ],
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
        case "View employees by manager":
          viewByManager();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Update an employee manager":
          updateEmployeeManager();
          break;
        default: 
          db.end();
      }
  });
}

async function viewByManager() {
  const managerChoices = await queries.getEmployeeChoices();
  inquirer
    .prompt([
    {
      type: 'list',
      message: "Which manager would you like to view the employees of?",
      choices: managerChoices,
      name: 'manager',
    },
  ])
    .then((response) => {
      queries.viewByManager(
        response.manager, 
        chooseAction
      );
  });
}

function addDepartment() {
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

async function addRole() {
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

async function addEmployee() {
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
      queries.addEmployee(
        response.firstName, 
        response.lastName, 
        response.role,
        response.manager, 
        chooseAction
      );
  });
}

async function updateEmployeeRole() {
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
      queries.updateEmployeeRole(
        response.employee, 
        response.role, 
        chooseAction
        );
  });
}

async function updateEmployeeManager() {
  const employeeChoices = await queries.getEmployeeChoices();
  inquirer
    .prompt([
    {
      type: 'list',
      message: "Which employee would you like to update the manager of?",
      choices: employeeChoices,
      name: 'employee',
    },
    {
      type: 'list',
      message: "Who would you like the employee's new manager to be?",
      choices: employeeChoices,
      name: 'manager',
    },
  ])
    .then((response) => {
      queries.updateEmployeeManager(
        response.employee, 
        response.manager, 
        chooseAction
        );
  });
}

app.use((req, res) => {
  res.status(404).end();
});

chooseAction();
