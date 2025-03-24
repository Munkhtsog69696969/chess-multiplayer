"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersTurn = exports.getMatchActionsByUserId = exports.getMatchActionsByMatchId = exports.getMatchActions = exports.pushActionToMatchActions = exports.addAction = exports.ChessPiece = void 0;
var ChessPiece;
(function (ChessPiece) {
    ChessPiece["WhiteKing"] = "\u2654";
    ChessPiece["WhiteQueen"] = "\u2655";
    ChessPiece["WhiteRook"] = "\u2656";
    ChessPiece["WhiteBishop"] = "\u2657";
    ChessPiece["WhiteKnight"] = "\u2658";
    ChessPiece["WhitePawn"] = "\u2659";
    ChessPiece["BlackKing"] = "\u265A";
    ChessPiece["BlackQueen"] = "\u265B";
    ChessPiece["BlackRook"] = "\u265C";
    ChessPiece["BlackBishop"] = "\u265D";
    ChessPiece["BlackKnight"] = "\u265E";
    ChessPiece["BlackPawn"] = "\u265F";
})(ChessPiece || (exports.ChessPiece = ChessPiece = {}));
let matchActions = [];
// Function to add a new match action
const addAction = (matchAction) => {
    matchActions.push(matchAction);
};
exports.addAction = addAction;
// Function to push an action to the match actions
const pushActionToMatchActions = (userId, action) => {
    for (const matchAction of matchActions) {
        if (matchAction.user1Id == userId || matchAction.user2Id == userId) {
            matchAction.actions.push(action);
        }
    }
};
exports.pushActionToMatchActions = pushActionToMatchActions;
// Function to get all match actions
const getMatchActions = () => {
    return matchActions;
};
exports.getMatchActions = getMatchActions;
// Function to get match actions by matchId
const getMatchActionsByMatchId = (matchId) => {
    return matchActions.find(matchAction => matchAction.matchId === matchId);
};
exports.getMatchActionsByMatchId = getMatchActionsByMatchId;
const getMatchActionsByUserId = (userId) => {
    for (const matchAction of matchActions) {
        if (matchAction.user1Id == userId || matchAction.user2Id == userId) {
            return matchAction;
        }
    }
};
exports.getMatchActionsByUserId = getMatchActionsByUserId;
const isUsersTurn = (userId) => {
    for (const matchAction of matchActions) {
        if (matchAction.user1Id === userId || matchAction.user2Id === userId) {
            const isUser1Turn = matchAction.actions.length % 2 === 0 && matchAction.user1Id === userId;
            const isUser2Turn = matchAction.actions.length % 2 === 1 && matchAction.user2Id === userId;
            if (isUser1Turn || isUser2Turn) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    return false;
};
exports.isUsersTurn = isUsersTurn;
