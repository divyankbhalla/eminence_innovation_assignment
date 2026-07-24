import User from "../models/User.js";
import ROLES from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async ({ username, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already registered");
    }

    const userCount = await User.countDocuments();

    const role =
        userCount === 0
            ? ROLES.MANAGER
            : ROLES.EMPLOYEE;

    const user = await User.create({
        username,
        email,
        password,
        role,
    });

    const token = generateToken(user);

    return {
        token,
        user,
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({
        email,
    }).select("+password");

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isMatch =
        await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const token = generateToken(user);

    return {
        token,
        user,
    };
}

export { registerUser, loginUser };