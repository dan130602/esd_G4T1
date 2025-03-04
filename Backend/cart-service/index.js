import express from 'express';
import morgan from 'morgan';
import cartRoutes from './routes/cartRoutes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

/*
* to push to cart : POST http://localhost:3007/cart
* to get cart by userId : GET http://localhost:3007/cart/1
* to remove from cart : POST http://localhost:3007/cart/remove
*/
app.use("/cart", cartRoutes);

app.get('/', (req, res) => {
    res.send('api test');
});


const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
