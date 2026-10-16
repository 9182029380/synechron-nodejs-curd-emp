# Employee App — Node.js + Express + MySQL (CRUD + PATCH)

A small app to Create, Read, Update (PUT), Partially update (PATCH) and Delete employees.
One table (`employees`) with 10 attributes.

## Project structure

```
employee-app/
├── server.js          <- Express API + MySQL connection
├── schema.sql         <- creates database, table, sample rows
├── package.json
├── .env.example       <- copy to .env and set your MySQL password
└── public/
    └── index.html     <- the web page (form + table)
```

## Table: employees (10 attributes)

| # | Column      | Type                    |
|---|-------------|-------------------------|
| 1 | id          | INT, auto increment, PK |
| 2 | first_name  | VARCHAR(50)             |
| 3 | last_name   | VARCHAR(50)             |
| 4 | email       | VARCHAR(100), unique    |
| 5 | phone       | VARCHAR(15)             |
| 6 | department  | VARCHAR(50)             |
| 7 | designation | VARCHAR(50)             |
| 8 | salary      | DECIMAL(10,2)           |
| 9 | hire_date   | DATE                    |
| 10| status      | ENUM('Active','Inactive')|

## Steps to run

**Step 1 — Install**
- Node.js (v18 or newer): https://nodejs.org
- MySQL Server (v8): https://dev.mysql.com/downloads/

**Step 2 — Unzip the project and open a terminal inside the `employee-app` folder**

**Step 3 — Create the database and table**
```
mysql -u root -p < schema.sql
```
(Enter your MySQL password. Or open `schema.sql` in MySQL Workbench and run it.)

**Step 4 — Configure the database connection**
- Copy `.env.example` to a new file named `.env`
- Open `.env` and put your MySQL password in `DB_PASSWORD`

**Step 5 — Install dependencies**
```
npm install
```

**Step 6 — Start the server**
```
npm start
```

**Step 7 — Open the app**
Go to http://localhost:3000 in your browser.

## API endpoints

| Method | URL                   | What it does                         |
|--------|-----------------------|--------------------------------------|
| POST   | /api/employees        | Create an employee                   |
| GET    | /api/employees        | List all employees                   |
| GET    | /api/employees/:id    | Get one employee                     |
| PUT    | /api/employees/:id    | Update all fields                    |
| PATCH  | /api/employees/:id    | Update only the fields you send      |
| DELETE | /api/employees/:id    | Delete an employee                   |

### PATCH example (change only the status)
```
curl -X PATCH http://localhost:3000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Inactive"}'
```

### POST example
```
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Sita","last_name":"Rao","email":"sita@example.com","department":"Finance","designation":"Accountant","salary":50000}'
```

## Troubleshooting

- **ER_ACCESS_DENIED_ERROR** — wrong password in `.env`.
- **ER_BAD_DB_ERROR** — you skipped Step 3 (run `schema.sql`).
- **ECONNREFUSED** — MySQL server is not running; start it first.
- **Port already in use** — change `PORT` in `.env`.
