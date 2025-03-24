"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authSocket = (socket, next) => {
    var _a;
    try {
        const token = (_a = socket.handshake.headers.cookie) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        if (!token) {
            return next(new Error("Authorization token is missing"));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your secret key");
        socket.data.userId = decoded.userId;
        next();
    }
    catch (err) {
        next(new Error("Invalid token"));
    }
};
exports.default = authSocket;
