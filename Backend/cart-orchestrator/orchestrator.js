import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const CART_MICROSERVICE_URL = 'http://cart-service:3007/cart';

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
