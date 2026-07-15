import app from "./src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";


dotenv.config();
// invokeGeminiAi();

const PORT = process.env.PORT || 3000;

connectToDB();
// console.log("Gemini Key:", process.env.GOOGLE_GENAI_API_KEY);

 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

