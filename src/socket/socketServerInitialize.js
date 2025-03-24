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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authSocket_1 = __importDefault(require("../middlewares/authSocket"));
const connectionHandler_1 = __importDefault(require("./handlers/connectionHandler"));
const disconnectionHandler_1 = __importDefault(require("./handlers/disconnectionHandler"));
const matchmakingHandler_1 = __importDefault(require("./handlers/matchmakingHandler"));
const inMatchHandler_1 = __importDefault(require("./handlers/inMatchHandler"));
const socketServerInitialize = (io) => {
    try {
        // Socket middleware after connection
        io.use((socket, next) => {
            (0, authSocket_1.default)(socket, next);
        });
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            // Socket middleware for each event
            socket.use((packet, next) => {
                (0, authSocket_1.default)(socket, next);
            });
            (0, connectionHandler_1.default)(socket);
            socket.on("matchmaking", () => {
                (0, matchmakingHandler_1.default)(socket, io);
            });
            socket.on("in_match_action", (data) => {
                (0, inMatchHandler_1.default)(socket, io, data);
            });
            socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
                (0, disconnectionHandler_1.default)(socket);
            }));
        }));
    }
    catch (err) {
        console.error("Error in socketServerInitialize:", err);
    }
};
exports.default = socketServerInitialize;
