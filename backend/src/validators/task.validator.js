import { body, param, validationResult } from "express-validator";
import TASK_STATUS from "../constants/taskStatus.js";
import TASK_PRIORITY from "../constants/taskPriority.js";

export const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Task title must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("priority")
        .optional()
        .isIn(Object.values(TASK_PRIORITY))
        .withMessage("Invalid task priority"),

    body("status")
        .optional()
        .isIn(Object.values(TASK_STATUS))
        .withMessage("Invalid task status"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid due date")
        .toDate(),

    body("assignedTo")
        .optional()
        .isMongoId()
        .withMessage("Invalid user id")
];

export const taskIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid task id"),
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

export const updateTaskValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Task title must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("priority")
        .optional()
        .isIn(Object.values(TASK_PRIORITY))
        .withMessage("Invalid task priority"),

    body("status")
        .optional()
        .isIn(Object.values(TASK_STATUS))
        .withMessage("Invalid task status"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid due date")
        .toDate(),

    body("assignedTo")
        .optional()
        .isMongoId()
        .withMessage("Invalid user id"),
];