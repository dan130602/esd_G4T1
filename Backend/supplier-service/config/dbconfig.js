import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";

// Get current file directory equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const sequelize = new Sequelize(
    process.env.commerce_db_name, // Database name
    process.env.commerce_db_user, // Username
    process.env.commerce_db_password, // Password
    {
        // host: process.env.dbHost, // Database host
        host: "commerce-db",
        port: process.env.commerce_db_port, // Database port
        dialect: "postgres", // Specify PostgreSQL
        logging: false, // Disable SQL logging (optional)
        pool: {
            max: 10, // Max number of connections in pool
            min: 0, // Min number of connections in pool
            acquire: 30000, // Max time (ms) to try getting a connection
            idle: 10000 // Time (ms) before a connection is released
        }
    }
);

export default sequelize;

