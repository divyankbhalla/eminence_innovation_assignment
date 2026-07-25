import jwt from "jsonwebtoken";
import User from "../models/User.js";

const registerSocketEvents = (io) => {
    io.on("connection", async (socket) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                socket.disconnect(true);
                return;
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id);

            if (!user) {
                socket.disconnect(true);
                return;
            }

            socket.user = user;

            socket.join(`user:${user._id}`);
            socket.join(`role:${user.role}`);

            console.log(
                `${user.username} connected`
            );

            socket.on("disconnect", () => {
                console.log(
                    `${user.username} disconnected`
                );
            });
        } catch (error) {
            console.error(
                "Socket authentication failed:",
                error.message
            );

            socket.disconnect(true);
        }
    });
};

export default registerSocketEvents;