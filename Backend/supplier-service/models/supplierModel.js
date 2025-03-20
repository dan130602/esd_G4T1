import sequelize from "../config/dbconfig.js";
import { DataTypes } from "sequelize";

const Supplier = sequelize.define(
    "supplier_returns",
    {
        return_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        state_of_good:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        return_status:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: true, 
        freezeTableName: true, 
        createdAt: "created_at", 
        updatedAt: "updated_at",
    }
)

export default Supplier;