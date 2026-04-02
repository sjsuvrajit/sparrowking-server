import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool, {query} from "./config/database";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "Welcome to the Sparrow King API!",
    });
});

// Database test endpoint
app.get('/db-test', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    res.json({
      success: true,
      database: 'connected',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
})