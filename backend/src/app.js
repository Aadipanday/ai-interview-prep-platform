import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.route.js";
import interviewRouter from "../routes/interview.routes.js";


const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;