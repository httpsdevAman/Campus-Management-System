import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { fileURLToPath } from "url";

import grievanceRoutes from "./routes/grievance.route.js";
import courseRoutes from "./routes/course.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import resourceRoutes from "./routes/resource.routes.js";
import assignmentRoutes from "./routes/assignment.route.js";
import submissionRoutes from "./routes/submission.route.js";
import calendarRoutes from "./routes/calendar.route.js"
import opportunityRoutes from "./routes/opportunity.route.js"
import userRoutes from "./routes/user.route.js" 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

// Ensure upload directories exist (multer does not create them)
["uploads", "uploads/resources", "uploads/assignments", "uploads/submissions"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const app = express();

// CORS - allow frontend origins (Vercel + local dev)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5000",
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        },
    credentials: true,
  })
);

// Middleware 
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API is running...");
}); 

// Routes 
app.use('/api/auth', authRoutes)
app.use('/api/grievances', grievanceRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/uploads', express.static("uploads"))
app.use('/api/assignment', assignmentRoutes)
app.use('/api/submit', submissionRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/opportunities', opportunityRoutes)
app.use('/api/users', userRoutes)

if (process.env.NODE_ENV === "production") {

    const frontendPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(frontendPath));

    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

        
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to Database
    connectDB();
});
