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
const prisma = new client_1.PrismaClient();
const disconnectionHandler = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Client disconnected");
    (0, onlineUsers_1.removeUser)(socket.id);
    console.log("onlineUsers:", (0, onlineUsers_1.getOnlineUsers)());
    try {
        yield prisma.user.update({
            where: { id: socket.data.userId },
            data: { online: false },
        });
        console.log(`User ${socket.data.userId} is now offline`);
    }
    catch (err) {
        console.error("Error updating user status to offline:", err);
    }
});
exports.default = disconnectionHandler;
