const express = require('express');
const { Pool } = require('pg');
const admin = require('./firebaseAdmin'); 
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL client setup using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Register a new user
app.post('/register', async (req, res) => {
  const { email, full_name, password } = req.body;

  try {
    // Check if the email already exists in PostgreSQL
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password, // Firebase handles password security
      displayName: full_name,
    });

    // Store the new user information in PostgreSQL
    const insertResult = await pool.query(
      'INSERT INTO users (email, full_name, firebase_uid) VALUES ($1, $2, $3) RETURNING *',
      [email, full_name, userRecord.uid]
    );

    res.status(201).json({ message: 'User created successfully', user: insertResult.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in the user with Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Return the user data 
    res.status(200).json({ message: 'Login successful', user: userRecord });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

