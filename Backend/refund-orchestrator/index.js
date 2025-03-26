import express from 'express';
import morgan from 'morgan';


const app = express();

app.use(express.json());
app.use("/", supplierRoutes);
app.use(morgan('dev'));



app.get('/', (req, res) => {
    res.send('api test');
});


const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
