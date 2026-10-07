import mongoose from "mongoose";

const tokenBlackList = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "1d" // Automatically delete expired tokens after 24 hours
    }
});

const TokenBlackList = mongoose.model("TokenBlackList", tokenBlackList);
export default TokenBlackList;

