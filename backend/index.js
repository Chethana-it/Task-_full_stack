const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Create task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO task (title, description) VALUES (?, ?)',
    [title, description]
  );
  res.status(201).json({ id: result.insertId });
});

// List latest 5 incomplete
app.get('/tasks', async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM task WHERE completed = 0 ORDER BY created_at DESC LIMIT 5'
  );
  res.json(rows);
});

// Mark done
app.patch('/tasks/:id/done', async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.execute(
    'UPDATE task SET completed = 1 WHERE id = ?',
    [id]
  );
  if (result.affectedRows === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on port ${port}`));
