import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
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
app.use(helmet({
  crossOriginResourcePolicy: false, // For handling external images/assets
}));
app.use(compression());
app.use(morgan('common')); // Use 'common' for production logging

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for a real app
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Allowed Origins handling
const frontendUrls = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:8080"];

app.use(express.json({
  limit: '100mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString()
  }
}));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.use(cors({ origin: frontendUrls, credentials: true }));

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

    const httpServer = createServer(app);

    // Setup Socket.io
    const io = new Server(httpServer, {
      cors: {
        origin: frontendUrls,
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join a specific course room to receive chat/notifications
      socket.on("join_course", (courseId) => {
        socket.join(courseId);
        console.log(`Socket ${socket.id} joined course: ${courseId}`);
      });

      // Handle chat messages in course
      socket.on("send_message", (data) => {
        io.to(data.courseId).emit("receive_message", data);
      });

      // Handle broadcast notifications
      socket.on("send_notification", (data) => {
        io.emit("receive_notification", data);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    const server = httpServer.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    server.timeout = 600000; // 10 minutes timeout for handling large uploads
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
