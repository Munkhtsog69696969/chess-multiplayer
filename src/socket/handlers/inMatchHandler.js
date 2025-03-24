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
const inMatchUsers_1 = require("../gameStates/inMatchUsers");
const chessActions_1 = require("../gameStates/chessActions");
const chessActions_2 = require("../gameStates/chessActions");
const chessBoardBuilder_1 = require("../gameFunctions/chessBoardBuilder");
const chessMoveValidator_1 = require("../validators/chessMoveValidator");
const prisma = new client_1.PrismaClient();
const inMatchHandler = (socket, io, action) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("In match action!");
    const userId = socket.data.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (user && !user.inMatch) {
            console.log("User is not in match");
            socket.emit("in_match_error", {
                message: "You are not in match!",
                code: "not_in_match"
            });
            return new Error("User us not in match");
        }
        const inMatchUsers = (0, inMatchUsers_1.getInMatchUsers)();
        const inMatchPairs = (0, inMatchUsers_1.getInMatchPairs)();
        const isInMatchUsers = inMatchUsers.some(user => user.userId === userId);
        const isInMatchPairs = inMatchPairs.some(pair => pair.user1Id === userId || pair.user2Id === userId);
        if (!isInMatchUsers || !isInMatchPairs) {
            console.log("User is not in match users or pairs!");
            socket.emit("in_match_error", {
                message: "You are not in in match users or pairs!",
                code: "not_in_game_state"
            });
            return new Error("User is not in match users or pairs!");
        }
        const myTurn = (0, chessActions_1.isUsersTurn)(userId);
        if (!myTurn) {
            socket.emit("in_match_error", ({
                code: "not_your_turn",
                message: "Its not your turn!"
            }));
            return;
        }
        const matchActions = (0, chessActions_2.getMatchActionsByUserId)(userId);
        if (!matchActions) {
            socket.emit("in_match_error", ({
                code: "no_match_actions",
                message: "There is no match Actions!"
            }));
            return;
        }
        const isWhite = matchActions.user1Id == userId;
        const chessBoard = (0, chessBoardBuilder_1.chessBoardBuilder)(matchActions);
        const validMove = (0, chessMoveValidator_1.isValidMove)(action, chessBoard, isWhite);
        if (!validMove) {
            socket.emit("in_match_error", {
                code: "invalid_move",
                message: "The move is invalid!"
            });
            return;
        }
        (0, chessActions_2.pushActionToMatchActions)(userId, action);
        const updatedMatchActions = (0, chessActions_2.getMatchActionsByUserId)(userId);
        if (!updatedMatchActions) {
            socket.emit("in_match_error", {
                code: "no_updated_match_actions",
                message: "There are no updated match actions!"
            });
            return;
        }
        const updatedChessBoard = (0, chessBoardBuilder_1.chessBoardBuilder)(updatedMatchActions);
        const opponentSocketId = (0, inMatchUsers_1.getOpponentSocketId)(userId);
        if (opponentSocketId) {
            io.to(opponentSocketId).emit("move_made", ({
                chessboard: updatedChessBoard
            }));
            socket.emit("move_made", ({
                chessboard: updatedChessBoard
            }));
        }
    }
    catch (err) {
        console.log("In match error:", err);
    }
});
exports.default = inMatchHandler;
