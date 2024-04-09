// internship_display.js

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
  queueLimit: 0,
});

// internship_display.js
// internship_display.js
router.get('/internship/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM internship_applications');
    connection.release();

    console.log('Fetched Rows:', rows);  // Add this line

    // Log raw created_at values
    const createdDates = rows.map(row => row.created_at);
    console.log('Raw Created At Dates:', createdDates);

    // Add image URLs to the response
    const rowsWithImageUrls = rows.map(row => ({
      ...row,
      photo_url: row.photo ? `data:image/jpeg;base64,${row.photo.toString('base64')}` : null,
    }));

    console.log('Rows with Image URLs:', rowsWithImageUrls);

    res.json(rowsWithImageUrls);
  } catch (error) {
    console.error('Failed to fetch internship records:', error);
    res.status(500).json({ error: 'Failed to fetch internship records.' });
  }
});
module.exports = router;
