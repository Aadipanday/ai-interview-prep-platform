import mongoose from "mongoose";

const tokenBlackList = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    
    }
);

const TokenBlackList = mongoose.model("TokenBlackList", tokenBlackList);
export default TokenBlackList;

