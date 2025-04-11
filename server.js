const express = require("express");
const pg = require("pg");
const morgan = require("morgan");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgress://localhost/acme_hr_directory"
);

const server = express();

async function init() {}

init();
