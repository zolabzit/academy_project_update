const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer'); // Import nodemailer

const internshipRouter = express.Router();
const app = express();

// Configure body-parser and multer as before

// Configure your MySQL connection pool as before

// Configure multer upload for resume and photo as before

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Update with your Gmail address
    pass: 'your-password' // Update with your Gmail password
  }
});

internshipRouter.post('/internship', (req, res) => {
  uploadResume(req, res, async (err) => {
    if (err) {
      console.error('Resume upload error:', err);
      return res.status(400).json({ error: 'Failed to upload resume.' });
    }

    uploadPhoto(req, res, async (err) => {
      if (err) {
        console.error('Profile photo upload error:', err);
        return res.status(400).json({ error: 'Failed to upload profile photo.' });
      }

      const formData = req.body;
      const resumeFile = req.file;
      const photoFile = req.file;

      try {
        const connection = await pool.getConnection();
        const sql = 'INSERT INTO internship_applications (full_name, education, phone, email, gender, university, study_area, completion_year, resume, cover_letter, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
          formData.fullName,
          formData.education,
          formData.phone,
          formData.email,
          formData.gender,
          formData.university,
          formData.studyArea,
          formData.completionYear,
          resumeFile.buffer,
          formData.coverLetter,
          photoFile.buffer
        ];

        await connection.query(sql, values);
        connection.release();

        // Send email notification to the office
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: 'Krishnavenifullstack2024@gmail.com', // Update with the office email address
          subject: 'New Student Registration',
          text: 'A new student has registered. Check the database for details.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email sending error:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        console.log('Application saved successfully:', formData);
        res.json({ message: 'Application received successfully!' });
      } catch (error) {
        console.error('Failed to save application:', error);
        res.status(500).json({ error: 'Failed to save the application.' });
      }
    });
  });
});

module.exports = internshipRouter;
