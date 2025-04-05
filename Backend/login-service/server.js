  const express = require('express');
  const { Pool } = require('pg');
  const admin = require('./firebaseAdmin'); 
  const app = express();
  const port = process.env.PORT || 3000;
  const cors = require('cors');

  // Middleware to parse JSON bodies
  app.use(express.json());

  app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5175'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
  }));
  

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
      // Check if email exists in PostgreSQL
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create user in Firebase
      await admin.auth().createUser({
        email: email,
        password: password,
        displayName: full_name,
      });

      // Store user in PostgreSQL 
      const insertResult = await pool.query(
        'INSERT INTO users (email, full_name) VALUES ($1, $2) RETURNING *',
        [email, full_name]
      );

      res.status(201).json({ message: 'User created successfully', user: insertResult.rows[0] });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // Login 
  app.post('/login', async (req, res) => {
    const { token } = req.body;

    try {
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const email = decodedToken.email;

      // Check if the user exists in PostgreSQL
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found in local DB' });
      }

      return res.status(200).json({
        message: 'Login successful',
        user: result.rows[0],
      });
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });

  app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
