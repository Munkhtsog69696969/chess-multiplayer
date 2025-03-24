"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chessBoardBuilder = void 0;
const chessActions_1 = require("../gameStates/chessActions");
const initialSetup = [
    [chessActions_1.ChessPiece.BlackRook, chessActions_1.ChessPiece.BlackKnight, chessActions_1.ChessPiece.BlackBishop, chessActions_1.ChessPiece.BlackQueen, chessActions_1.ChessPiece.BlackKing, chessActions_1.ChessPiece.BlackBishop, chessActions_1.ChessPiece.BlackKnight, chessActions_1.ChessPiece.BlackRook],
    [chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn, chessActions_1.ChessPiece.BlackPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn, chessActions_1.ChessPiece.WhitePawn],
    [chessActions_1.ChessPiece.WhiteRook, chessActions_1.ChessPiece.WhiteKnight, chessActions_1.ChessPiece.WhiteBishop, chessActions_1.ChessPiece.WhiteQueen, chessActions_1.ChessPiece.WhiteKing, chessActions_1.ChessPiece.WhiteBishop, chessActions_1.ChessPiece.WhiteKnight, chessActions_1.ChessPiece.WhiteRook]
];
const chessBoardBuilder = (matchActions) => {
    // Create a deep copy of the initial setup to avoid mutating the original array
    const boardState = initialSetup.map(row => row.slice());
    // Apply each action to the board state
    for (const action of matchActions.actions) {
        const from = parseSquare(action.from_square);
        const to = parseSquare(action.to_square);
        if (from && to) {
            const piece = boardState[from[0]][from[1]];
            boardState[from[0]][from[1]] = null;
            boardState[to[0]][to[1]] = piece;
        }
    }
    return boardState;
};
exports.chessBoardBuilder = chessBoardBuilder;
const parseSquare = (square) => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1], 10); // Fix: invert rank to match array indices
    if (file < 0 || file > 7 || rank < 0 || rank > 7) {
        console.log("Invalid square:", square);
        return null;
    }
    console.log(`Parsing square ${square} to coordinates [${rank},${file}]`);
    return [rank, file];
};
