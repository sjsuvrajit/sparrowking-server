import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME || "sparrowking_dev",
    username: process.env.DB_USER || "sparrow",
    password: process.env.DB_PASSWORD || "sparrow123",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5433"),
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false, // Log SQL queries in development
    pool: {
        max:5, // Maximum number of connections in the pool
        min:0, // Minimum number of connections in the pool
        acquire:30000, // Maximum time (in ms) that pool will try to get connection before throwing error
        idle:10000 // Maximum time (in ms) that a connection can be idle before being released
    },
});

//test the connection
export const testConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('✅ Sequelize connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

export default sequelize;
