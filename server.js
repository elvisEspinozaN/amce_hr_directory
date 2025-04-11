const express = require("express");
const pg = require("pg");
const morgan = require("morgan");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_directory"
);

const server = express();

async function init() {
  await client.connect();
  console.log("connected to db");

  let SQL = `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      department_id INTEGER REFERENCES departments(id) NOT NULL
    );
  `;

  await client.query(SQL);
  console.log("tables created");

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

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`listening on port ${port}`));
}

init();

server.use(express.json());
server.use(morgan("dev"));

// routes
server.get("/api/departments", async (req, res, next) => {
  try {
    const response = await client.query("SELECT * FROM departments");
    res.send(response.rows);
  } catch (err) {
    next(err);
  }
});

server.get("/api/employees", async (req, res, next) => {
  try {
    const response = await client.query("SELECT * FROM employees");
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  }
});

server.post("/api/employees", async (req, res, next) => {
  try {
    const SQL = `INSERT INTO employees(name, department_id) VALUES($1, $2) RETURNING *;`;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.department_id,
    ]);
    res.status(201).send(response.rows);
  } catch (err) {
    next(err);
  }
});

server.put("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = `UPDATE employees
      SET name=$1, department_id=$2, updated_at=now()
      WHERE id=$3
      RETURNING *;`;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.department_id,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  }
});

server.delete("/api/employees/:id", async (req, res, next) => {
  try {
    await client.query(`DELETE FROM employees WHERE id=$1`, [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// Error handling
server.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});
