import sequelize from '../config/dbconfig.js';
import { DataTypes } from 'sequelize';

const Shop = sequelize.define(
    "items",
    {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        item_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "items", // Ensure Sequelize maps to the correct table name
        timestamps: false, // Disable createdAt and updatedAt fields
    }
);

export default Shop;
