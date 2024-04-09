// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mainRouter = require('./server');
const internshipRouter = require('./server_internship');
const downloadResumeRouter = require('./resume_download'); // Add this line
const displayRouter = require('./internship_display');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Mount the routers
app.use('/api', mainRouter);module.exports = internshipRouter; // Export the router

app.use('/api', internshipRouter);
app.use(express.static('public')); // assuming your HTML and script.js are in the 'public' folder

app.use('/api/resume', downloadResumeRouter); // Mount the resume download router

app.use('/api', displayRouter);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
