const express = require('express');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Database
const initDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT,
        phone TEXT,
        age TEXT,
        timestamp TEXT
      )
    `);
    client.release();
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

initDb();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get('/api/test', (req, res) => {
  res.send('Server is alive and running latest Node.js code!');
});

// Submit Lead
app.post('/api/submit_lead', async (req, res) => {
  const { name, phone, age } = req.body;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (!name || !phone || !age) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  try {
    // Save to DB
    const query = 'INSERT INTO leads (name, phone, age, timestamp) VALUES ($1, $2, $3, $4) RETURNING *';
    await pool.query(query, [name, phone, age, timestamp]);

    // Send Email (Async)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'New Lead - Star Health Premium',
      text: `Name: ${name}\nPhone: ${phone}\nAge: ${age}\nTimestamp: ${timestamp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ status: 'success', message: 'Lead submitted successfully' });
  } catch (err) {
    console.error('Error submitting lead:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get Leads
app.get('/api/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, phone, age, timestamp FROM leads ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get Stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM leads');
    const today = new Date().toISOString().substring(0, 10);
    const todayResult = await pool.query('SELECT COUNT(*) FROM leads WHERE timestamp LIKE $1', [`%${today}%`]);
    
    res.json({
      total: parseInt(totalResult.rows[0].count),
      today: parseInt(todayResult.rows[0].count)
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
