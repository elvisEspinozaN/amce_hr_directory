const express = require("express");
const pg = require("pg");
const morgan = require("morgan");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgress://localhost/acme_hr_directory"
);

const server = express();

async function init() {
  await client.connect();
  console.log("conencted to db");

  // create tables with foreign key relationships
  let SQL = `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(49) NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      department_id INTEGER REFERENCES departments(id) NOT NULL
    );
  `;

  await client.query(SQL);
  console.log("tables created");

  // seeded initial data
  SQL = `
    INSERT INTO departments(name) VALUES('Human Resources');
    INSERT INTO departments(name) VALUES('Finance');
    INSERT INTO departments(name) VALUES('Marketing');

    INSERT INTO employees(name, department_id) VALUES('Elvis Esp', (SELECT id FROM departments WHERE name='Human Resources'));
    INSERT INTO employees(name, department_id) VALUES('Sophia Pen', (SELECT id FROM departments WHERE name='Finance'));
    INSERT INTO employees(name, department_id) VALUES('Joe Smith', (SELECT id FROM departments WHERE name='Marketing'));
  `;

  await client.query(SQL);
  console.log("data seeded");
}

init();
