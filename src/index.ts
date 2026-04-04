import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool, {query} from "./config/database";
import { testConnection } from "./config/sequelize";
import User from "./models/Users";

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

app.post('/test-user', async (req: Request, res: Response) => {
  try {
    const user = await User.create({
      email: 'test@example.com',
      password_hash: 'temp_hash_123',
      full_name: 'Test User',
      role: 'customer',
    });
    
    res.json({
      success: true,
      message: 'User created!',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

//start the server
const startServer = async () => {
    try {
        //Test database connection before starting the server
        await testConnection();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on PORT ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start the server:', error);
        process.exit(1);
    }
}

startServer();