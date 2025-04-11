# acme hr directory

![postman testing](https://i.imgur.com/dpoAHJM.png)
![code status](https://i.imgur.com/moMKTRr.png)

## Overview

A RESTful API for managing Acme Corporation's employee directory using Express.js and PostgreSQL. Provides full CRUD operations for employee and department management with proper database relationships and error handling.

## Features

- View all departments and employees
- Create new employee records
- Update existing employee information
- Delete employee records

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Postman

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/departments`   | Get all departments      |
| GET    | `/employees`     | Get all employees        |
| POST   | `/employees`     | Create new employee      |
| PUT    | `/employees/:id` | Update existing employee |
| DELETE | `/employees/:id` | Remove employee          |

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/elvis-espinoza/)

✉️ elvis.espinoza.navarrete@outlook.com

## Acknowledgments

- Fullstack Academy instructors
