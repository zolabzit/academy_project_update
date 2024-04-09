const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer'); // Import nodemailer
const mysql = require('mysql2'); // Import MySQL

const app = express();
const internshipRouter = express.Router();

// Configure body-parser, multer, and MySQL connection pool as before

const pool = mysql.createPool({
  host: 'localhost', // Update with your MySQL host
  user: 'root', // Update with your MySQL username
  password: 'root', // Update with your MySQL password
  database: 'zolabzacademy' // Update with your MySQL database name
});

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'krishhsoft@gmail.com', // Update with your Gmail address
    pass: 'zbkjuabukaisllpc' // Update with your generated App Password
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the destination directory for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Include file extension in the filename
  }
});

const upload = multer({ storage: storage });

// Route to handle internship application form submission
internshipRouter.post('/internship', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), (req, res) => {
  // Extract form data
  const { fullName, education, phone, email, gender, university, studyArea, completionYear, coverLetter } = req.body;
  const resumePath = req.files['resume'][0].path;
  const photoPath = req.files['photo'][0].path;

  // Prepare SQL query
  const sql = 'INSERT INTO internship_applications (full_name, education, phone, email, gender, university, study_area, completion_year, resume, cover_letter, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  // Execute SQL query
  pool.query(sql, [fullName, education, phone, email, gender, university, studyArea, completionYear, resumePath, coverLetter, photoPath], (error, results) => {
    if (error) {
      console.error('Database insertion error:', error);
      res.status(500).json({ error: 'Failed to save application data to the database.' });
    } else {
      console.log('Database insertion success:', results);
      // Send email notification
      const mailOptions = {
        from: 'krishhsoft@gmail.com', // Update with your Gmail address
        to: 'krishnavenisoft1985@gmail.com', // Update with the specified email address
        subject: 'New Student Registration',
        text: 'A new student has registered. Check the database for details.',
        attachments: [
          {
            filename: req.files['resume'][0].filename, // Get the filename of the uploaded resume
            path: req.files['resume'][0].path // Get the path of the uploaded resume
          }
        ]
      };

      transporter.sendMail(mailOptions, (emailError, info) => {
        if (emailError) {
          console.error('Email sending error:', emailError);
          res.status(500).json({ error: 'Failed to send email.' });
        } else {
          console.log('Email sent:', info.response);
          res.json({ message: 'Application received successfully!' });
        }
      });
    }
  });
});

module.exports = internshipRouter;
