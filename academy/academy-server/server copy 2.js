const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'zolabzacademy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/internship', upload.single('resume'), async (req, res) => {
  const formData = req.body;
  const resumeFile = req.file;

  try {
    const connection = await pool.getConnection();
    const sql =
      'INSERT INTO internship_applications (full_name, phone, email, gender, university, study_area, completion_year, resume, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      formData.fullName,
      formData.phone,
      formData.email,
      formData.gender,
      formData.university,
      formData.studyArea,
      formData.completionYear,
      resumeFile.buffer,
      formData.coverLetter
    ];

    await connection.query(sql, values);
    connection.release();

    console.log('Application saved successfully:', formData);
    res.json({ message: 'Application received successfully!' });
  } catch (error) {
    console.error('Failed to save application:', error);
    res.status(500).json({ error: 'Failed to save the application.' });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query('SELECT * FROM internship_applications');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
