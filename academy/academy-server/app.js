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
app.use('/api', mainRouter);
app.use('/api', internshipRouter);
app.use('/api/resume', downloadResumeRouter);
app.use('/api', displayRouter);

// Serve static files (like images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
