import { Server as SocketIOServer, Socket } from "socket.io";
import authSocket from "../middlewares/authSocket";
import connectionHandler from "./handlers/connectionHandler";
import disconnectionHandler from "./handlers/disconnectionHandler";
import matchmakingHandler from "./handlers/matchmakingHandler";
import inMatchHandler from "./handlers/inMatchHandler";

const socketServerInitialize = (io: SocketIOServer) => {
    try {
        // Socket middleware after connection
        io.use((socket, next) => {
            authSocket(socket, next);
        });

        io.on("connection", async (socket: Socket) => {

            // Socket middleware for each event
            socket.use((packet, next) => {
                authSocket(socket, next);
            });

            connectionHandler(socket);

            socket.on("matchmaking", ()=>{
                matchmakingHandler(socket,io)
            })

            socket.on("in_match_action",(data)=>{
                inMatchHandler(socket,io,data)
            })

            socket.on("disconnect", async () => {
                disconnectionHandler(socket);
            });
        });
    } catch (err) {
        console.error("Error in socketServerInitialize:", err);
    }
};

export default socketServerInitialize;
