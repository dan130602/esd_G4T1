import express from 'express';
import morgan from 'morgan';
import sequelize from "./config/dbconfig.js";
import shopRoutes from "./routes/shopRoutes.js";


const app = express();

app.use(express.json());
app.use("/", shopRoutes);
app.use(morgan('dev'));


const MAX_RETRIES = 5;
const RETRY_INTERVAL = 2000; // 2 seconds delay

const syncDatabase = async () => {
    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            console.log(`Attempt ${i}: Syncing database...`);
            await sequelize.sync(); // Wait for sync
            console.log("Database synced successfully!");
            return; // Exit loop on success
        } catch (error) {
            console.error(`Database Sync Error on attempt ${i}:`, error);
        }

        if (i < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL)); // Wait before retrying
        }
    }

    console.error("Max retries reached. Exiting application.");
    process.exit(1); // Exit the application if all attempts fail
};

// Call the function
syncDatabase();

app.get('/', (req, res) => {
    res.send('api test');
});


const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
