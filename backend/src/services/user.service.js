import ROLES from "../constants/roles.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const getProfile = async (currentUser) => {
    const user = await User.findById(currentUser._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const getAllUsers = async () => {
    const users = await User.find()
        .populate("manager", "username email role")
        .populate("teamLead", "username email role")
        .sort({
            role: 1,
            username: 1,
        });

    return users;
};

const updateUserRole = async (userId, role) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (
        user.role === ROLES.MANAGER &&
        role !== ROLES.MANAGER
    ) {
        throw new ApiError(
            400,
            "Manager role cannot be changed"
        );
    }

    user.role = role;

    if (role === ROLES.TEAM_LEAD || role === ROLES.MANAGER) {
        user.teamLead = null;
    }

    await user.save();

    return user;
};

const assignTeamLead = async (
    userId,
    teamLeadId
) => {
    if (userId.toString() === teamLeadId.toString()) {
        throw new ApiError(
            400,
            "User cannot be assigned as their own Team Lead"
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === ROLES.MANAGER) {
        throw new ApiError(
            400,
            "Manager cannot be assigned a Team Lead"
        );
    }

    if (user.role === ROLES.TEAM_LEAD) {
        throw new ApiError(
            400,
            "Team Lead cannot be assigned a Team Lead"
        );
    }

    const teamLead = await User.findById(teamLeadId);

    if (!teamLead) {
        throw new ApiError(
            404,
            "Team Lead not found"
        );
    }

    if (teamLead.role !== ROLES.TEAM_LEAD) {
        throw new ApiError(
            400,
            "Selected user is not a Team Lead"
        );
    }

    user.teamLead = teamLead._id;

    await user.save();

    return await User.findById(user._id)
        .populate("teamLead", "username email role");
};

const getTeamMembers = async (currentUser) => {
    const teamMembers = await User.find({
        teamLead: currentUser._id,
    }).sort({
        username: 1,
    });

    return teamMembers;
};

export {
    getProfile,
    getAllUsers,
    updateUserRole,
    assignTeamLead,
    getTeamMembers,
};