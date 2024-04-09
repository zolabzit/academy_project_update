const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Import server.js
const serverApp = require('./server.js');
app.use('/server', serverApp);

// Import server_internship.js
const serverInternshipApp = require('./server_internship.js');
app.use('/server_internship', serverInternshipApp);

app.listen(PORT, () => {
  console.log(`Main server is running on http://localhost:${PORT}`);
});
