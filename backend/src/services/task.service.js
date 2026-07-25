import {
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
} from "../socket/emitters.js";

import Task from "../models/Task.js";
import User from "../models/User.js";

import ROLES from "../constants/roles.js";

import ApiError from "../utils/ApiError.js";

const getPopulatedTask = async (taskId) => {
    return await Task.findById(taskId)
        .populate(
            "assignedTo",
            "username email role teamLead"
        )
        .populate(
            "createdBy",
            "username email role"
        );
};

const createTask = async (taskData, currentUser) => {
    const {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedTo,
    } = taskData;

    let finalAssignedTo;

    switch (currentUser.role) {
        case ROLES.EMPLOYEE:
            finalAssignedTo = currentUser._id;
            break;

        case ROLES.MANAGER:
            if (!assignedTo) {
                finalAssignedTo = currentUser._id;
                break;
            }

            const managerAssignedUser = await User.findById(
                assignedTo
            );

            if (!managerAssignedUser) {
                throw new ApiError(
                    404,
                    "Assigned user not found"
                );
            }

            finalAssignedTo = managerAssignedUser._id;
            break;

        case ROLES.TEAM_LEAD:
            if (!assignedTo) {
                finalAssignedTo = currentUser._id;
                break;
            }

            const assignedUser = await User.findById(
                assignedTo
            );

            if (!assignedUser) {
                throw new ApiError(
                    404,
                    "Assigned user not found"
                );
            }

            const isSelf =
                assignedUser._id.toString() ===
                currentUser._id.toString();

            const isTeamMember =
                assignedUser.teamLead?.toString() ===
                currentUser._id.toString();

            if (!isSelf && !isTeamMember) {
                throw new ApiError(
                    403,
                    "You can only assign tasks to yourself or your team members"
                );
            }

            finalAssignedTo = assignedUser._id;
            break;

        default:
            throw new ApiError(
                403,
                "Invalid user role"
            );
    }

    const task = await Task.create({
        title,
        description,
        priority,
        status,
        dueDate,
        assignedTo: finalAssignedTo,
        createdBy: currentUser._id,
    });

    const populatedTask = await getPopulatedTask(
        task._id
    );

    emitTaskCreated(populatedTask);

    return populatedTask;
};

const getTasks = async (currentUser) => {
    let tasks;

    switch (currentUser.role) {
        case ROLES.MANAGER:
            tasks = await Task.find()
                .populate(
                    "assignedTo",
                    "username email role teamLead"
                )
                .populate(
                    "createdBy",
                    "username email role"
                )
                .sort({
                    createdAt: -1,
                });
            break;

        case ROLES.TEAM_LEAD:
            const teamMembers = await User.find({
                teamLead: currentUser._id,
            }).select("_id");

            const userIds = [
                currentUser._id,
                ...teamMembers.map(
                    (user) => user._id
                ),
            ];

            tasks = await Task.find({
                assignedTo: {
                    $in: userIds,
                },
            })
                .populate(
                    "assignedTo",
                    "username email role teamLead"
                )
                .populate(
                    "createdBy",
                    "username email role"
                )
                .sort({
                    createdAt: -1,
                });

            break;

        case ROLES.EMPLOYEE:
            tasks = await Task.find({
                assignedTo: currentUser._id,
            })
                .populate(
                    "assignedTo",
                    "username email role teamLead"
                )
                .populate(
                    "createdBy",
                    "username email role"
                )
                .sort({
                    createdAt: -1,
                });

            break;

        default:
            throw new ApiError(
                403,
                "Invalid user role"
            );
    }

    return tasks;
};

const getTaskById = async (
    taskId,
    currentUser
) => {
    const task = await getPopulatedTask(taskId);

    if (!task) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    switch (currentUser.role) {
        case ROLES.MANAGER:
            return task;

        case ROLES.TEAM_LEAD:
            const isSelf =
                task.assignedTo._id.toString() ===
                currentUser._id.toString();

            const isTeamMember =
                task.assignedTo.teamLead?.toString() ===
                currentUser._id.toString();

            if (!isSelf && !isTeamMember) {
                throw new ApiError(
                    403,
                    "Access denied"
                );
            }

            return task;

        case ROLES.EMPLOYEE:
            if (
                task.assignedTo._id.toString() !==
                currentUser._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "Access denied"
                );
            }

            return task;

        default:
            throw new ApiError(
                403,
                "Invalid user role"
            );
    }
};

const updateTask = async (
    taskId,
    taskData,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    switch (currentUser.role) {
        case ROLES.MANAGER:
            if (taskData.assignedTo) {
                const assignedUser =
                    await User.findById(
                        taskData.assignedTo
                    );

                if (!assignedUser) {
                    throw new ApiError(
                        404,
                        "Assigned user not found"
                    );
                }
            }

            break;

        case ROLES.TEAM_LEAD: {
            const currentAssignedUser =
                await User.findById(
                    task.assignedTo
                );

            const isSelf =
                currentAssignedUser._id.toString() ===
                currentUser._id.toString();

            const isTeamMember =
                currentAssignedUser.teamLead?.toString() ===
                currentUser._id.toString();

            if (!isSelf && !isTeamMember) {
                throw new ApiError(
                    403,
                    "Access denied"
                );
            }

            if (taskData.assignedTo) {
                const newAssignedUser =
                    await User.findById(
                        taskData.assignedTo
                    );

                if (!newAssignedUser) {
                    throw new ApiError(
                        404,
                        "Assigned user not found"
                    );
                }

                const canAssign =
                    newAssignedUser._id.toString() ===
                        currentUser._id.toString() ||
                    newAssignedUser.teamLead?.toString() ===
                        currentUser._id.toString();

                if (!canAssign) {
                    throw new ApiError(
                        403,
                        "You can only assign tasks to yourself or your team members"
                    );
                }
            }

            break;
        }

        case ROLES.EMPLOYEE:
            if (
                task.assignedTo.toString() !==
                currentUser._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "Access denied"
                );
            }

            taskData.assignedTo =
                currentUser._id;

            break;

        default:
            throw new ApiError(
                403,
                "Invalid user role"
            );
    }

    if (taskData.title !== undefined) {
        task.title = taskData.title;
    }

    if (taskData.description !== undefined) {
        task.description =
            taskData.description;
    }

    if (taskData.priority !== undefined) {
        task.priority = taskData.priority;
    }

    if (taskData.status !== undefined) {
        task.status = taskData.status;
    }

    if (taskData.dueDate !== undefined) {
        task.dueDate = taskData.dueDate;
    }

    if (taskData.assignedTo !== undefined) {
        task.assignedTo =
            taskData.assignedTo;
    }

    await task.save();

    const updatedTask =
        await getPopulatedTask(task._id);

    emitTaskUpdated(updatedTask);

    return updatedTask;
};

const deleteTask = async (
    taskId,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    switch (currentUser.role) {
        case ROLES.MANAGER:
            break;

        case ROLES.TEAM_LEAD: {
            const assignedUser =
                await User.findById(
                    task.assignedTo
                );

            if (!assignedUser) {
                throw new ApiError(
                    404,
                    "Assigned user not found"
                );
            }

            const isSelf =
                assignedUser._id.toString() ===
                currentUser._id.toString();

            const isTeamMember =
                assignedUser.teamLead?.toString() ===
                currentUser._id.toString();

            if (!isSelf && !isTeamMember) {
                throw new ApiError(
                    403,
                    "Access denied"
                );
            }

            break;
        }

        case ROLES.EMPLOYEE:
            if (
                task.assignedTo.toString() !==
                currentUser._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "Access denied"
                );
            }

            break;

        default:
            throw new ApiError(
                403,
                "Invalid user role"
            );
    }

    const populatedTask =
        await getPopulatedTask(task._id);

    await task.deleteOne();

    emitTaskDeleted(populatedTask);

    return;
};

export {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};