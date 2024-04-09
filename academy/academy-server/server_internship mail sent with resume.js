const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer'); // Import nodemailer

const app = express();
const internshipRouter = express.Router();

// Configure body-parser, multer, and MySQL connection pool as before

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
  // Process form data and save to database (you can add your database logic here)

  // Send email notification to the specified email address with attached resume
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ error: 'Failed to send email.' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Application received successfully!' });
    }
  });
});

module.exports = internshipRouter;
