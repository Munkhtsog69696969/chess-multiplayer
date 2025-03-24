"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const onlineUsers_1 = require("../gameStates/onlineUsers");
const matchMakingUsers_1 = require("../gameStates/matchMakingUsers");
const inMatchUsers_1 = require("../gameStates/inMatchUsers");
const prisma = new client_1.PrismaClient();
const connectionHandler = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Client connected");
    const userId = socket.data.userId;
    const socketId = socket.id;
    const userMatchmaking = (0, matchMakingUsers_1.getMatchmakingUsers)().find(user => user.userId === userId);
    const userInMatch = (0, inMatchUsers_1.getInMatchUsers)().find(user => user.userId === userId);
    const pairInMatch = (0, inMatchUsers_1.getInMatchPairs)().find(pair => pair.user1Id === userId || pair.user2Id === userId);
    // Update socket ID in matchmaking users
    if (userMatchmaking && userMatchmaking.socketId !== socketId) {
        (0, matchMakingUsers_1.updateMatchmakingUserSocketId)(userId, socketId);
    }
    // Update socket ID in in-match users
    if (userInMatch && userInMatch.socketId !== socketId) {
        (0, inMatchUsers_1.updateInMatchUserSocketId)(userId, socketId);
    }
    // Update socket ID in in-match pairs
    if (pairInMatch) {
        if ((pairInMatch.user1Id === userId && pairInMatch.user1SocketId !== socketId) ||
            (pairInMatch.user2Id === userId && pairInMatch.user2SocketId !== socketId)) {
            (0, inMatchUsers_1.updateInMatchPair)(userId, socketId);
        }
    }
    // Add user only if they are not in matchmaking or in-match lists
    if (!userMatchmaking && !userInMatch) {
        (0, onlineUsers_1.addUser)({ userId, socketId });
    }
    console.log("------------------------------");
    console.log("Online Users:", (0, onlineUsers_1.getOnlineUsers)());
    console.log("Online users count:", (0, onlineUsers_1.getOnlineUsers)().length);
    console.log("------------------------------");
    console.log("Matchmaking users:", (0, matchMakingUsers_1.getMatchmakingUsers)());
    console.log("Matchmaking users count:", (0, matchMakingUsers_1.getMatchmakingUsers)().length);
    console.log("------------------------------");
    console.log("In match users:", (0, inMatchUsers_1.getInMatchUsers)());
    console.log("In match users count:", (0, inMatchUsers_1.getInMatchUsers)().length);
    console.log("------------------------------");
    console.log("In match pairs:", (0, inMatchUsers_1.getInMatchPairs)());
    console.log("In match pairs count:", (0, inMatchUsers_1.getInMatchPairs)().length);
    console.log("------------------------------");
    // Update user status in the database
    try {
        yield prisma.user.update({
            where: { id: userId },
            data: { online: true },
        });
        console.log(`User ${userId} is now online`);
    }
    catch (err) {
        console.error("Error updating user status to online:", err);
    }
});
exports.default = connectionHandler;
