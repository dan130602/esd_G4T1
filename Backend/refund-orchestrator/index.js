import express from 'express';
import morgan from 'morgan';
import {startRefundStatusConsumer} from './kafka/consumer.js'; 
import { sendTransaction } from "./kafka/producer.js"
import refundRoutes from './routes/refundRoutes.js';
const app = express();


app.use(express.json());
app.use("/refunds", refundRoutes);
app.use(morgan('dev'));



app.get('/', (req, res) => {
    res.send('api test');
});

await startRefundStatusConsumer();

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
