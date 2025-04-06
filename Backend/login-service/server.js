const express = require('express');
const { Pool } = require('pg');
const admin = require('./firebaseAdmin'); 
const cors = require('cors'); // ✅ Only declare once
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(morgan('dev'));
app.use(express.json());


app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

// PostgreSQL client setup
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
    client.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error("❌ Failed to connect to PostgreSQL:", err);
    process.exit(1); // Exit the app if DB is critical
  });
// --- Routes ---

// Register route
app.post('/register', async (req, res) => {
  const { email, full_name, password } = req.body;
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: full_name,
    });

    const userId = userRecord.uid;

    const insertResult = await pool.query(
      'INSERT INTO users (user_id, email, full_name) VALUES ($1, $2, $3) RETURNING *',
      [userId, email, full_name]
    );

    res.status(201).json({ message: 'User created successfully', user: insertResult.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found in local DB' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from the login service!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
