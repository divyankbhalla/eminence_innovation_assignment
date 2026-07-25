import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    getProfile,
    getAllUsers,
    updateUserRole,
    assignTeamLead,
    getTeamMembers,
} from "../services/user.service.js";

const profile = asyncHandler(async (req, res) => {
    const user = await getProfile(req.user);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile fetched successfully",
            user
        )
    );
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsers();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            users
        )
    );
});

const updateRole = asyncHandler(async (req, res) => {
    const user = await updateUserRole(
        req.params.id,
        req.body.role
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "User role updated successfully",
            user
        )
    );
});

const assignLead = asyncHandler(async (req, res) => {
    const user = await assignTeamLead(
        req.params.id,
        req.body.teamLeadId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Team Lead assigned successfully",
            user
        )
    );
});

const teamMembers = asyncHandler(async (req, res) => {
    const members = await getTeamMembers(
        req.user
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Team members fetched successfully",
            members
        )
    );
});

export {
    profile,
    getUsers,
    updateRole,
    assignLead,
    teamMembers,
};