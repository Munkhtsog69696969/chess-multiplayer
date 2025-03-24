import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { addUser, getOnlineUsers, updateUserSocketId } from "../gameStates/onlineUsers";
import { getMatchmakingUsers, updateMatchmakingUserSocketId } from "../gameStates/matchMakingUsers";
import { getInMatchPairs, getInMatchUsers, updateInMatchPair, updateInMatchUserSocketId } from "../gameStates/inMatchUsers";

const prisma = new PrismaClient();

const connectionHandler = async (socket: Socket) => {
    console.log("Client connected");

    const userId = socket.data.userId;
    const socketId = socket.id;

    const userMatchmaking = getMatchmakingUsers().find(user => user.userId === userId);
    const userInMatch = getInMatchUsers().find(user => user.userId === userId);
    const pairInMatch = getInMatchPairs().find(pair => pair.user1Id === userId || pair.user2Id === userId);

    // Update socket ID in matchmaking users
    if (userMatchmaking && userMatchmaking.socketId !== socketId) {
        updateMatchmakingUserSocketId(userId, socketId);
    }

    // Update socket ID in in-match users
    if (userInMatch && userInMatch.socketId !== socketId) {
        updateInMatchUserSocketId(userId, socketId);
    }

    // Update socket ID in in-match pairs
    if (pairInMatch) {
        if (
            (pairInMatch.user1Id === userId && pairInMatch.user1SocketId !== socketId) ||
            (pairInMatch.user2Id === userId && pairInMatch.user2SocketId !== socketId)
        ) {
            updateInMatchPair(userId, socketId);
        }
    }

    // Add user only if they are not in matchmaking or in-match lists
    if (!userMatchmaking && !userInMatch) {
        addUser({ userId, socketId });
    }

    console.log("------------------------------");
    console.log("Online Users:", getOnlineUsers());
    console.log("Online users count:", getOnlineUsers().length);
    console.log("------------------------------");
    console.log("Matchmaking users:", getMatchmakingUsers());
    console.log("Matchmaking users count:", getMatchmakingUsers().length);
    console.log("------------------------------");
    console.log("In match users:", getInMatchUsers());
    console.log("In match users count:", getInMatchUsers().length);
    console.log("------------------------------");
    console.log("In match pairs:", getInMatchPairs());
    console.log("In match pairs count:", getInMatchPairs().length);
    console.log("------------------------------");

    // Update user status in the database
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { online: true },
        });
        console.log(`User ${userId} is now online`);
    } catch (err) {
        console.error("Error updating user status to online:", err);
    }
};

export default connectionHandler;
