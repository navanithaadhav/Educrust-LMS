import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import educatorRouter from "./routes/educatorRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import courseRouter from "./routes/courseRoute.js";


import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// ... other imports

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan('dev')); // Logging

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Boot server inside async function to handle async startup steps safely
const allowOrigins = ["http://localhost:5173"];
app.use(express.json({
  limit: '100mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString()
  }
}));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.use(cors({ origin: allowOrigins, credentials: true }));

async function start() {
  try {
    console.log("-----------------------------------------");
    console.log("   SERVER STARTING - RELOAD DETECTED     ");
    console.log("-----------------------------------------");
    await connectDB();
    console.log('Connected to DB');
    await connectCloudinary();

    // routes
    app.get("/", (req, res) => {
      res.send("API is working🤩🤩🤩🤩🤩🤩!");
    });

    app.use('/api/auth', authRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/educator', educatorRouter);
    app.use('/api/user', userRouter);
    app.use('/api/course', courseRouter);

    // Global Error Handler
    app.use((err: any, req: any, res: any, next: any) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });


    const server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    server.timeout = 600000; // 10 minutes timeout for handling large uploads
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
//api end point

// ...existing code moved into start()
