"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlineUsers = exports.removeUser = exports.updateUserSocketId = exports.addUser = void 0;
let onlineUsers = [];
const addUser = (user) => {
    onlineUsers.push(user);
};
exports.addUser = addUser;
const updateUserSocketId = (userId, newSocketId) => {
    const user = onlineUsers.find(user => user.userId === userId);
    if (user) {
        console.log("In match socket id is updated! ", "userId: ", userId, "old socket id: ", user.socketId, "new socket id: ", newSocketId);
        user.socketId = newSocketId;
    }
};
exports.updateUserSocketId = updateUserSocketId;
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
exports.removeUser = removeUser;
const getOnlineUsers = () => {
    return onlineUsers;
};
exports.getOnlineUsers = getOnlineUsers;
