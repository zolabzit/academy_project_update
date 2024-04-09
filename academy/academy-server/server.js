const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const mainRouter = express.Router(); // Use express.Router() to create a router

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'zolabzacademy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

mainRouter.post("/freereg", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All properties are required." });
  }

  const sql = "INSERT INTO free_class_reg (name, email, phone) VALUES (?, ?, ?)";
  try {
    console.log("Executing SQL:", sql, [name, email, phone]);
    const [rows, fields] = await pool.execute(sql, [name, email, phone]);
    console.log("Submission saved successfully:", rows);
    res.json({ message: "Submission saved successfully." });
  } catch (err) {
    console.error("Failed to save submission:", err.message); // Log detailed error message
    res.status(500).json({ error: "Failed to save the submission." });
  }
});

// Additional routes or middleware for the mainRouter can be added here

module.exports = mainRouter; // Export the router
