import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user = await User.findOne({
        _id: decoded.id,
        isActive: true,
    });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
});

export default authenticate;