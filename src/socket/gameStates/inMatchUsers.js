"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInMatchPairs = exports.getOpponentSocketId = exports.removeInMatchPair = exports.updateInMatchPair = exports.addInMatchPair = exports.getInMatchUsers = exports.removeInMatchUser = exports.updateInMatchUserSocketId = exports.addInMatchUser = void 0;
let inMatchUsers = [];
let inMatchPairs = [];
// InMatch user functions 
const addInMatchUser = (user) => {
    inMatchUsers.push(user);
};
exports.addInMatchUser = addInMatchUser;
const updateInMatchUserSocketId = (userId, newSocketId) => {
    const user = inMatchUsers.find(user => user.userId === userId);
    if (user) {
        console.log("In match socket id is updated! ", "userId: ", userId, "old socket id: ", user.socketId, "new socket id: ", newSocketId);
        user.socketId = newSocketId;
    }
};
exports.updateInMatchUserSocketId = updateInMatchUserSocketId;
const removeInMatchUser = (socketId) => {
    inMatchUsers = inMatchUsers.filter((user) => user.socketId !== socketId);
};
exports.removeInMatchUser = removeInMatchUser;
const getInMatchUsers = () => {
    return inMatchUsers;
};
exports.getInMatchUsers = getInMatchUsers;
// InMatch pair functions
const addInMatchPair = (pair) => {
    inMatchPairs.push(pair);
};
exports.addInMatchPair = addInMatchPair;
const updateInMatchPair = (userId, newSocketId) => {
    const pair = inMatchPairs.find(pair => pair.user1Id === userId || pair.user2Id === userId);
    if (pair) {
        if (pair.user1Id === userId) {
            pair.user1SocketId = newSocketId;
        }
        else if (pair.user2Id === userId) {
            pair.user2SocketId = newSocketId;
        }
    }
};
exports.updateInMatchPair = updateInMatchPair;
const removeInMatchPair = (userId) => {
    inMatchPairs = inMatchPairs.filter(pair => pair.user1Id !== userId && pair.user2Id !== userId);
};
exports.removeInMatchPair = removeInMatchPair;
const getOpponentSocketId = (userId) => {
    for (const inMatchPair of inMatchPairs) {
        if (inMatchPair.user1Id == userId) {
            return inMatchPair.user2SocketId;
        }
        if (inMatchPair.user2Id == userId) {
            return inMatchPair.user1SocketId;
        }
    }
};
exports.getOpponentSocketId = getOpponentSocketId;
const getInMatchPairs = () => {
    return inMatchPairs;
};
exports.getInMatchPairs = getInMatchPairs;
