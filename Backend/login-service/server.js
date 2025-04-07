const express = require('express');
const { Pool } = require('pg');
const admin = require('./firebaseAdmin');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL database");
    client.release();
  })
  .catch(err => {
    console.error("❌ Failed to connect to PostgreSQL:", err);
    process.exit(1);
  });

// --- Routes ---

// 🔐 Register
app.post('/register', async (req, res) => {
  const { email, full_name, token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    console.log("✅ Firebase UID:", uid); // <-- Add this line

    if (decodedToken.email !== email) {
      return res.status(401).json({ message: 'Email mismatch between token and payload' });
    }

    const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [uid]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists in DB' });
    }

    const safeName = full_name && full_name.trim() !== "" ? full_name : "Anonymous";
    const insertResult = await pool.query(
      'INSERT INTO users (user_id, email, full_name) VALUES ($1, $2, $3) RETURNING *',
      [uid, email, safeName]
    );

    return res.status(201).json({
      message: 'User registered and saved to DB',
      user: insertResult.rows[0]
    });

  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// 🔓 Login
app.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [uid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found in local DB' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: result.rows[0],
    });

  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Ping route
app.get("/", (req, res) => {
  res.send("Hello from the login service!");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
