import express from 'express';
import axios from 'axios';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
app.use(express.json());

const CART_MICROSERVICE_URL = 'http://cart-service:3007/cart';

const pool = new Pool({
    host: 'error-db', 
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'error_db'
});

pool.connect()
  .then(client => {
    console.log(" Connected to PostgreSQL database");
    client.release();
  })
  .catch(err => {
    console.error(" Failed to connect to PostgreSQL:", err);
    process.exit(1);
  });

  const createOrchestratorLogTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orchestrator_error_logs (
                id SERIAL PRIMARY KEY,
                route TEXT,
                message TEXT,
                payload JSONB,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log("orchestrator_error_logs table is ready.");
    } catch (err) {
        console.error("Failed to create error log table:", err);
    }
};
createOrchestratorLogTable();

const logError = async (route, message, payload) => {
    try {
        await pool.query(
            'INSERT INTO orchestrator_error_logs (route, message, payload) VALUES ($1, $2, $3)',
            [route, message, JSON.stringify(payload)]
        );
    } catch (err) {
        console.error('Failed to log error to orchestrator_error_logs:', err);
    }
};

// Forward request to add item to cart
app.post('/add-to-cart', async (req, res) => {
    try {
        const { userId, item } = req.body;
        if (!userId || !item) {
            return res.status(400).json({ error: 'User ID and item are required' });
        }

        const response = await axios.post(`${CART_MICROSERVICE_URL}`, { userId, item });
        res.json(response.data);  // send the response from the cart service back to the UI
    } catch (error) {
        console.error('Error adding to cart:', error);
        await logError('/add-to-cart', error.message, { userId, item });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Forward request to get the cart
app.get('/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.get(`${CART_MICROSERVICE_URL}/${userId}`);
        res.json(response.data);  // send the cart data back to the UI
    } catch (error) {
        console.error('Error getting cart:', error);
        await logError('/cart/:userId', error.message, { userId });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Forward request to remove item from cart
app.post('/remove-from-cart', async (req, res) => {
    try {
        const { userId, itemId, decreaseBy } = req.body;
        if (!userId || !itemId || !decreaseBy) {
            return res.status(400).json({ error: 'User ID, Item ID, and decreaseBy are required' });
        }

        const response = await axios.post(`${CART_MICROSERVICE_URL}/remove`, { userId, itemId, decreaseBy });
        res.json(response.data);  // send the response from the cart service back to the UI
    } catch (error) {
        console.error('Error removing from cart:', error);
        await logError('remove-from-cart', error.message, { userId, itemId, decreaseBy });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Orchestrator is running!');
});

const PORT = 4000; 
app.listen(PORT, () => {
    console.log(`Orchestrator is running on http://localhost:${PORT}`);
});
