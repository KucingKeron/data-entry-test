const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: '615243abc',
  port: 5432,
});

// Routes // Get data from SQL Table -> localhost:5000

////////////////////////////////PULL DATA TO DISPLAY///////////////////////////////////
app.get('/entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entries');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////PUSH DATA TO TABLE///////////////////////////////////
app.post('/entries', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO entries (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////EDIT DATA///////////////////////////////////////////
app.put('/entries/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE entries SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////DELETE DATA///////////////////////////////////
app.delete('/entries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM entries WHERE id = $1', [id]);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
