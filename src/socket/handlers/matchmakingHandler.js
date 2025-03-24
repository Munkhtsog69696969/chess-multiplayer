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
const matchMakingUsers_1 = require("../gameStates/matchMakingUsers");
const inMatchUsers_1 = require("../gameStates/inMatchUsers");
const chessActions_1 = require("../gameStates/chessActions");
const prisma = new client_1.PrismaClient();
const timeoutTime = 15 * 1000;
const matchmakingHandler = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Client connected to matchmaking");
    const userId = socket.data.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (user && user.inMatch) {
            console.log("User is already in match!");
            socket.emit("matchmaking_error", {
                message: "You already in a match!",
                code: "in_match"
            });
            return new Error("User is already in match!");
        }
        if (user && user.matchmaking) {
            return new Error("User is already in matchmaking!");
        }
        yield prisma.user.update({
            where: { id: userId },
            data: { matchmaking: true }
        });
        (0, matchMakingUsers_1.addMatchmakingUser)({ userId: userId, socketId: socket.id });
        const start = performance.now();
        //60 seconds matchmaking timeout
        const timeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                clearInterval(interval);
                console.log("Matchmaking timed out");
                socket.emit("matchmaking_error", {
                    message: "Matchmaking timed out!",
                    code: "timed_out"
                });
                yield prisma.user.update({
                    where: { id: userId },
                    data: { matchmaking: false }
                });
                (0, matchMakingUsers_1.removeMatchmakingUser)(socket.id);
            }
            catch (err) {
                console.log("Error canceling matchmaking", err);
            }
        }), timeoutTime);
        const interval = setInterval(() => {
            const timeLeftInSeconds = Math.floor((timeoutTime - (performance.now() - start)) / 1000);
            console.log(timeLeftInSeconds);
            socket.emit("matchmaking_timer", `Finding match ${timeLeftInSeconds}`);
        }, 1000);
        //If succesful clear timeout and user found a match
        const matchMakingUsers = (0, matchMakingUsers_1.getMatchmakingUsers)().filter(user => user.socketId !== socket.id);
        for (const opponent of matchMakingUsers) {
            const opponentUser = yield prisma.user.findUnique({
                where: { id: opponent.userId }
            });
            if (!(opponentUser === null || opponentUser === void 0 ? void 0 : opponentUser.inMatch) && (opponentUser === null || opponentUser === void 0 ? void 0 : opponentUser.matchmaking)) {
                clearInterval(interval);
                clearTimeout(timeout);
                //update both user's fields in database
                yield prisma.user.update({
                    where: { id: userId },
                    data: { inMatch: true, matchmaking: false }
                });
                yield prisma.user.update({
                    where: { id: opponent.userId },
                    data: { inMatch: true, matchmaking: false }
                });
                //remove from matchmaking
                (0, matchMakingUsers_1.removeMatchmakingUser)(opponent.socketId);
                (0, matchMakingUsers_1.removeMatchmakingUser)(socket.id);
                //add to in match users
                (0, inMatchUsers_1.addInMatchUser)({ userId: opponent.userId, socketId: opponent.socketId });
                (0, inMatchUsers_1.addInMatchUser)({ userId: userId, socketId: socket.id });
                //add to in match pairs
                (0, inMatchUsers_1.addInMatchPair)({
                    user1Id: userId,
                    user2Id: opponent.userId,
                    user1SocketId: socket.id,
                    user2SocketId: opponent.socketId
                });
                //create match and userMatches
                const match = yield prisma.match.create({
                    data: {
                        duration: 0,
                        moves: [],
                        users: {
                            create: [
                                { user: { connect: { id: userId } } },
                                { user: { connect: { id: opponent.userId } } }
                            ]
                        }
                    },
                    include: {
                        users: true
                    }
                });
                (0, chessActions_1.addAction)({
                    matchId: match.id,
                    user1Id: userId,
                    user2Id: opponent.userId,
                    actions: []
                });
                //send match found to its opponent
                io.to(opponent.socketId).emit("match_found", {
                    fromUserId: userId,
                    fromSocketId: socket.id,
                    toUserId: opponent.userId,
                    toSocketId: opponent.socketId
                });
                io.to(socket.id).emit("match_found", {
                    fromUserId: opponent.userId,
                    fromSocketId: opponent.socketId,
                    toUserId: userId,
                    toSocketId: socket.id
                });
                break;
            }
        }
    }
    catch (err) {
        console.error("Error in matchmakingHandler:", err);
    }
});
exports.default = matchmakingHandler;
