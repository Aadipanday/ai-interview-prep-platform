import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.route.js";
import interviewRouter from "../routes/interview.routes.js";


const app = express();

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
];
 
app.use(
    cors({
        origin: (origin, callback) => {
            // `origin` is undefined for same-origin/non-browser requests
            // (e.g. curl, server-to-server) — allow those through too.
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked for origin: ${origin}`));
            }
        },
        credentials: true, // required since the frontend sends cookies via withCredentials
    })
);



app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;