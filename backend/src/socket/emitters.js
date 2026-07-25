import { getIO } from "./socket.js";

const notifyUsers = (event, task, payload = task) => {
    const io = getIO();

    io.to(`user:${task.assignedTo._id}`).emit(event, payload);

    io.to("role:MANAGER").emit(event, payload);

    if (task.assignedTo.teamLead) {
        io.to(`user:${task.assignedTo.teamLead}`).emit(event, payload);
    }
};

const emitTaskCreated = (task) => {
    notifyUsers("task:created", task);
};

const emitTaskUpdated = (task) => {
    notifyUsers("task:updated", task);
};

const emitTaskDeleted = (task) => {
    notifyUsers("task:deleted", task, {
        taskId: task._id,
    })
};

export {
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
};