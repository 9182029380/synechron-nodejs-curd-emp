require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- MySQL connection pool ----------
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true // return DATE as 'YYYY-MM-DD' string
});

// Columns that clients are allowed to send (id is auto-generated)
const FIELDS = [
  'first_name', 'last_name', 'email', 'phone',
  'department', 'designation', 'salary', 'hire_date', 'status'
];
const REQUIRED = ['first_name', 'last_name', 'email', 'department', 'designation'];

// Small helper to turn DB errors into friendly responses
function handleError(res, err) {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Email already exists' });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error', details: err.message });
}

// ---------- CREATE ----------
// POST /api/employees
app.post('/api/employees', async (req, res) => {
  try {
    const missing = REQUIRED.filter((f) => !req.body[f]);
    if (missing.length) {
      return res.status(400).json({ error: 'Missing fields: ' + missing.join(', ') });
    }
    const cols = FIELDS.filter((f) => req.body[f] !== undefined && req.body[f] !== '');
    const values = cols.map((f) => req.body[f]);
    const sql = `INSERT INTO employees (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`;
    const [result] = await pool.query(sql, values);
    res.status(201).json({ message: 'Employee created', id: result.insertId });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- READ (all) ----------
// GET /api/employees
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- READ (one) ----------
// GET /api/employees/:id
app.get('/api/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Employee not found' });
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- UPDATE (full) ----------
// PUT /api/employees/:id  -> replaces all fields
app.put('/api/employees/:id', async (req, res) => {
  try {
    const missing = REQUIRED.filter((f) => !req.body[f]);
    if (missing.length) {
      return res.status(400).json({ error: 'Missing fields: ' + missing.join(', ') });
    }
    const values = FIELDS.map((f) => (req.body[f] === '' ? null : req.body[f] ?? null));
    const sql = `UPDATE employees SET ${FIELDS.map((f) => f + ' = ?').join(', ')} WHERE id = ?`;
    const [result] = await pool.query(sql, [...values, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee updated (PUT)' });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- UPDATE (partial) ----------
// PATCH /api/employees/:id  -> updates only the fields you send
app.patch('/api/employees/:id', async (req, res) => {
  try {
    const cols = FIELDS.filter((f) => req.body[f] !== undefined);
    if (!cols.length) {
      return res.status(400).json({ error: 'Send at least one field to update' });
    }
    const values = cols.map((f) => req.body[f]);
    const sql = `UPDATE employees SET ${cols.map((f) => f + ' = ?').join(', ')} WHERE id = ?`;
    const [result] = await pool.query(sql, [...values, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee updated (PATCH)', updated: cols });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- DELETE ----------
// DELETE /api/employees/:id
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- Start server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Employee app running at http://localhost:${PORT}`);
});
