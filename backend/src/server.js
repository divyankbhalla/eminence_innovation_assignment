import dotenv from "dotenv";
dotenv.config();

import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initializeSocket } from "./socket/socket.js";
import registerSocketEvents from "./socket/socketEvents.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = initializeSocket(server);

registerSocketEvents(io);

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();