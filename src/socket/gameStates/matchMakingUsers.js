"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchmakingUsers = exports.removeMatchmakingUser = exports.updateMatchmakingUserSocketId = exports.addMatchmakingUser = void 0;
let matchmakingUsers = [];
const addMatchmakingUser = (user) => {
    matchmakingUsers.push(user);
};
exports.addMatchmakingUser = addMatchmakingUser;
const updateMatchmakingUserSocketId = (userId, newSocketId) => {
    const user = matchmakingUsers.find(user => user.userId === userId);
    if (user) {
        console.log("In match socket id is updated! ", "userId: ", userId, "old socket id: ", user.socketId, "new socket id: ", newSocketId);
        user.socketId = newSocketId;
    }
};
exports.updateMatchmakingUserSocketId = updateMatchmakingUserSocketId;
const removeMatchmakingUser = (socketId) => {
    matchmakingUsers = matchmakingUsers.filter((user) => user.socketId !== socketId);
};
exports.removeMatchmakingUser = removeMatchmakingUser;
const getMatchmakingUsers = () => {
    return matchmakingUsers;
};
exports.getMatchmakingUsers = getMatchmakingUsers;
