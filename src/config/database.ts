import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5433"),
    database: process.env.DB_NAME || "sparrowking_dev",
    user: process.env.DB_USER || "sparrow",
    password: process.env.DB_PASSWORD || "sparrow123",
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the database connection on startup
pool.on("connect", () => {
    console.log("Database pool connected");
})

pool.on("error", (err) => {
    console.log("Unexpected Database Error", err);
    process.exit(-1); // Exit the process if the database connection fails
});

// Export a query function for easy use
export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export default pool;