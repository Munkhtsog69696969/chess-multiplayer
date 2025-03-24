import { Socket } from "socket.io"
import { PrismaClient } from "@prisma/client"
import { removeUser, getOnlineUsers } from "../gameStates/onlineUsers";

const prisma = new PrismaClient();

const disconnectionHandler = async (socket: Socket) => {
    console.log("Client disconnected");
    removeUser(socket.id);
    console.log("onlineUsers:", getOnlineUsers());

    try{
        await prisma.user.update({
            where: { id: socket.data.userId },
            data: { online: false },
        });
        console.log(`User ${socket.data.userId} is now offline`);
    }catch(err){
        console.error("Error updating user status to offline:", err);
    }
}

export default disconnectionHandler;