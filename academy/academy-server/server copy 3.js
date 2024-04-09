const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const { Readable } = require('stream');
const cors = require('cors');

app.use(cors());

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'zolabzacademy',
});

app.get('/api/downloadResume/:fullName', async (req, res) => {
  const fullName = req.params.fullName;

  try {
    const query = 'SELECT resume FROM internship_applications WHERE full_name = ?';
    const [result] = await db.execute(query, [fullName]);

    if (!result || result.length === 0) {
      res.status(404).send('Resume not found');
      return;
    }

    const resumeBuffer = result[0].resume;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fullName.replace(/\s+/g, '_')}_Resume.pdf`);

    res.send(resumeBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
