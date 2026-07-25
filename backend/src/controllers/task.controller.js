import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../services/task.service.js";

const create = asyncHandler(async (req, res) => {
    const task = await createTask(
        req.body,
        req.user
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Task created successfully",
            task
        )
    );
});

const getAll = asyncHandler(async (req, res) => {
    const tasks = await getTasks(req.user);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Tasks fetched successfully",
            tasks
        )
    );
});

const getById = asyncHandler(async (req, res) => {
    const task = await getTaskById(
        req.params.id,
        req.user
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Task fetched successfully",
            task
        )
    );
});

const update = asyncHandler(async (req, res) => {
    const task = await updateTask(
        req.params.id,
        req.body,
        req.user
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Task updated successfully",
            task
        )
    );
});

const remove = asyncHandler(async (req, res) => {
    await deleteTask(
        req.params.id,
        req.user
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Task deleted successfully",
            null
        )
    );
});

export {
    create,
    getAll,
    getById,
    update,
    remove,
};