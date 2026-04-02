import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
})