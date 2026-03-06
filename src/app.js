// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.route.js";
import { dbConnection } from "./config/db.js";
import cookieParser from "cookie-parser";

// load env
dotenv.config();

const app = express();
dbConnection();

// ===== Middlewares =====
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:7000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// ===== Health Check =====
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API is running 🚀"
    });
});

// ===== Routes =====
app.use("/api/v1", routes);

// ===== 404 Handler =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// ===== Error Handler =====
app.use(errorHandler);

export default app;
