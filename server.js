const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // Put your local password below
    password: 'your password here',
    database: 'employees_db'
  },
  console.log(`Connected to the database.`)
);