import jwt from "jsonwebtoken";
import TokenBlackList from "../models/tokenBlackList.model.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    
    const blacklistedToken = await TokenBlackList.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: "Unauthorized: Token is Invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware;