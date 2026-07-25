import { body, param, validationResult } from "express-validator";
import ROLES from "../constants/roles.js";

export const userIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid user id"),
];

export const updateRoleValidator = [
    ...userIdValidator,

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(ROLES))
        .withMessage("Invalid role"),
];

export const assignTeamLeadValidator = [
    ...userIdValidator,

    body("teamLeadId")
        .notEmpty()
        .withMessage("Team Lead is required")
        .isMongoId()
        .withMessage("Invalid Team Lead id"),
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        })),
    });
};