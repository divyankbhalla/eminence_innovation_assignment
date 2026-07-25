import mongoose from "mongoose";
import TASK_STATUS from "../constants/taskStatus.js";
import TASK_PRIORITY from "../constants/taskPriority.js";

const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },

        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.PENDING,
        },

        priority: {
            type: String,
            enum: Object.values(TASK_PRIORITY),
            default: TASK_PRIORITY.MEDIUM,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;