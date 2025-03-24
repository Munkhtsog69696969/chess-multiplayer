import { MatchAction, ChessPiece } from "../gameStates/chessActions";

const initialSetup: (ChessPiece | null)[][] = [
    [ChessPiece.BlackRook, ChessPiece.BlackKnight, ChessPiece.BlackBishop, ChessPiece.BlackQueen, ChessPiece.BlackKing, ChessPiece.BlackBishop, ChessPiece.BlackKnight, ChessPiece.BlackRook],
    [ChessPiece.BlackPawn, ChessPiece.BlackPawn, ChessPiece.BlackPawn, ChessPiece.BlackPawn, ChessPiece.BlackPawn, ChessPiece.BlackPawn, ChessPiece.BlackPawn, ChessPiece.BlackPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [ChessPiece.WhitePawn, ChessPiece.WhitePawn, ChessPiece.WhitePawn, ChessPiece.WhitePawn, ChessPiece.WhitePawn, ChessPiece.WhitePawn, ChessPiece.WhitePawn, ChessPiece.WhitePawn],
    [ChessPiece.WhiteRook, ChessPiece.WhiteKnight, ChessPiece.WhiteBishop, ChessPiece.WhiteQueen, ChessPiece.WhiteKing, ChessPiece.WhiteBishop, ChessPiece.WhiteKnight, ChessPiece.WhiteRook]
];

export const chessBoardBuilder = (matchActions: MatchAction): (ChessPiece | null)[][] => {
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

const parseSquare = (square: string): [number, number] | null => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1], 10); // Fix: invert rank to match array indices
    if (file < 0 || file > 7 || rank < 0 || rank > 7) {
        console.log("Invalid square:", square);
        return null;
    }
    console.log(`Parsing square ${square} to coordinates [${rank},${file}]`);
    return [rank, file];
};