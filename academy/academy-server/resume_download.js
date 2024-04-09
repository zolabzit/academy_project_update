const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'zolabzacademy',
});

router.get('/:fullName', async (req, res) => {
  const fullName = req.params.fullName;

  try {
    const query = 'SELECT resume FROM internship_applications WHERE full_name = ?';
    const [result] = await db.execute(query, [fullName]);

    if (!result || result.length === 0) {
      res.status(404).send('Resume not found');
      return;
    }

    const resumeBuffer = result[0].resume;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename=resume.docx`); // Use inline to display the file

    res.send(resumeBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
