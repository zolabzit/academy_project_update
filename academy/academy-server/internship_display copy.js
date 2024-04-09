const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'zolabzacademy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint to get all internship records
router.get('/internship/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM internship_applications');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch internship records:', error);
    res.status(500).json({ error: 'Failed to fetch internship records.' });
  }
});

module.exports = router;
