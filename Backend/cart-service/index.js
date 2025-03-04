import express from 'express';
import morgan from 'morgan';
import cartRoutes from './routes/cartRoutes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use("/cart", cartRoutes);

app.get('/', (req, res) => {
    res.send('api test');
});


const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
