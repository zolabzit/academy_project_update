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
router.get('/api/internship/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [row] = await connection.query('SELECT * FROM internship_applications WHERE id = ?', [req.params.id]);
      connection.release();
  
      if (row && row.length > 0) {
        res.json(row[0]);
      } else {
        res.status(404).json({ error: 'Internship application not found' });
      }
    } catch (error) {
      console.error('Failed to fetch internship application:', error);
      res.status(500).json({ error: 'Failed to fetch internship application.' });
    }
  });
  
module.exports = router;
