import { ChessPiece, Action } from "../gameStates/chessActions";

export const isValidMove = (action: Action, boardState: (ChessPiece | null)[][], isWhite: boolean): boolean => {
    console.log("Validating move:", action);
    const { chess_piece, from_square, to_square } = action;
    const from = parseSquare(from_square);
    const to = parseSquare(to_square);

    if(!from || !to){
        console.log("No source or destination square!")
        return false
    }

    const whitePieces=[
        ChessPiece.WhiteKing,
        ChessPiece.WhiteQueen,
        ChessPiece.WhiteRook,
        ChessPiece.WhiteKnight,
        ChessPiece.WhiteBishop,
        ChessPiece.WhitePawn
    ]

    if (!isWhite && whitePieces.includes(chess_piece)) {
        console.log("Invalid: Black's turn but trying to move white piece");
        return false;
    }
    
    if (isWhite && !whitePieces.includes(chess_piece)) {
        console.log("Invalid: White's turn but trying to move black piece");
        return false;
    }

    switch (chess_piece) {
        case ChessPiece.WhitePawn:
        case ChessPiece.BlackPawn:
            return validatePawnMove(from, to, boardState, isWhite);
        case ChessPiece.WhiteRook:
        case ChessPiece.BlackRook:
            return validateRookMove(from, to, boardState, isWhite);
        case ChessPiece.WhiteKnight:
        case ChessPiece.BlackKnight:
            return validateKnightMove(from, to, boardState, isWhite);
        case ChessPiece.WhiteBishop:
        case ChessPiece.BlackBishop:
            return validateBishopMove(from, to, boardState, isWhite);
        case ChessPiece.WhiteQueen:
        case ChessPiece.BlackQueen:
            return validateQueenMove(from, to, boardState, isWhite);
        case ChessPiece.WhiteKing:
        case ChessPiece.BlackKing:
            return validateKingMove(from, to, boardState, isWhite);
        default:
            console.log("5: Unknown piece type");
            return false;
    }
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

const validatePawnMove = (from: [number, number], to: [number, number], boardState: (ChessPiece | null)[][], isWhite:boolean): boolean => {
    console.log(`Validating pawn move from [${from}] to [${to}] isWhite:${isWhite}`);
    console.log(boardState)
    

    //one step validation
    //white moves up (-1 in array)
    if(isWhite && from[0]-1==to[0] && from[1]==to[1] && boardState[to[0]][to[1]]==null){
        console.log("Valid white pawn single step");
        return true;
    }
    //black moves down (+1 in array)
    if(!isWhite && from[0]+1==to[0] && from[1]==to[1] && boardState[to[0]][to[1]]==null){
        console.log("Valid black pawn single step");
        return true;
    }

    //two step validation
    //white from starting position (rank 6 in array)
    if(isWhite && from[0]==6 && to[0]==4 && from[1]==to[1] && 
       boardState[to[0]][to[1]]==null && boardState[5][from[1]]==null){
        console.log("Valid white pawn double step");
        return true;
    }
    //black from starting position (rank 1 in array)
    if(!isWhite && from[0]==1 && to[0]==3 && from[1]==to[1] && 
       boardState[to[0]][to[1]]==null && boardState[2][from[1]]==null){
        console.log("Valid black pawn double step");
        return true;
    }

    //eating validation
    //white captures diagonally forward (-1 row)
    if(isWhite && from[0]-1==to[0] && (from[1]+1==to[1] || from[1]-1==to[1]) && 
       boardState[to[0]][to[1]]!=null){
        console.log("Valid white pawn capture");
        return true;
    }
    //black captures diagonally forward (+1 row)
    if(!isWhite && from[0]+1==to[0] && (from[1]+1==to[1] || from[1]-1==to[1]) && 
       boardState[to[0]][to[1]]!=null){
        console.log("Valid black pawn capture");
        return true;
    }

    console.log("Invalid pawn move");
    return false;
};

const validateRookMove = (from: [number, number], to: [number, number], boardState: (ChessPiece | null)[][], isWhite:boolean): boolean => {
    console.log(`Validating rook move from [${from}] to [${to}] isWhite:${isWhite}`);

    // Rook can only move horizontally or vertically
    if (from[0] !== to[0] && from[1] !== to[1]) {
        console.log("Invalid rook move: not horizontal or vertical");
        return false;
    }

    // Check if path is clear
    const rowDir = Math.sign(to[0] - from[0]);
    const colDir = Math.sign(to[1] - from[1]);
    let currentRow = from[0] + rowDir;
    let currentCol = from[1] + colDir;

    while (currentRow !== to[0] || currentCol !== to[1]) {
        if (boardState[currentRow][currentCol] !== null) {
            console.log(`Invalid rook move: piece blocking at [${currentRow},${currentCol}]`);
            return false;
        }
        currentRow += rowDir;
        currentCol += colDir;
    }

    console.log("Valid rook move");
    return true;
};

const validateKnightMove = (from: [number, number], to: [number, number], boardState: (ChessPiece | null)[][], isWhite:boolean): boolean => {
    console.log(`Validating knight move from [${from}] to [${to}] isWhite:${isWhite}`);

    const rowDiff = Math.abs(to[0] - from[0]);
    const colDiff = Math.abs(to[1] - from[1]);

    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
        console.log("Valid knight move");
        return true;
    }

    console.log("Invalid knight move: not L-shaped");
    return false;
};

const validateBishopMove = (from: [number, number], to: [number, number], boardState: (ChessPiece | null)[][], isWhite:boolean): boolean => {
    console.log(`Validating bishop move from [${from}] to [${to}] isWhite:${isWhite}`);

    const rowDiff = Math.abs(to[0] - from[0]);
    const colDiff = Math.abs(to[1] - from[1]);

    if (rowDiff !== colDiff) {
        console.log("Invalid bishop move: not diagonal");
        return false;
    }

    // Check if path is clear
    const rowDir = Math.sign(to[0] - from[0]);
    const colDir = Math.sign(to[1] - from[1]);
    let currentRow = from[0] + rowDir;
    let currentCol = from[1] + colDir;

    while (currentRow !== to[0] && currentCol !== to[1]) {
        if (boardState[currentRow][currentCol] !== null) {
            console.log(`Invalid bishop move: piece blocking at [${currentRow},${currentCol}]`);
            return false;
        }
        currentRow += rowDir;
        currentCol += colDir;
    }

    console.log("Valid bishop move");
    return true;
};

const validateQueenMove = (from: [number, number], to: [number, number], boardState: (ChessPiece | null)[][], isWhite:boolean): boolean => {
    console.log(`Validating queen move from [${from}] to [${to}] isWhite:${isWhite}`);

    // Queen combines rook and bishop movements
    if (validateRookMove(from, to, boardState, isWhite) || 
        validateBishopMove(from, to, boardState, isWhite)) {
        console.log("Valid queen move");
        return true;
    }

    console.log("Invalid queen move");
    return false;
};

const validateKingMove = (from: [number, number], to: [number, number], boardState: (ChessPiece | null)[][], isWhite:boolean): boolean => {
    console.log(`Validating king move from [${from}] to [${to}] isWhite:${isWhite}`);

    const rowDiff = Math.abs(to[0] - from[0]);
    const colDiff = Math.abs(to[1] - from[1]);

    // King can move one square in any direction
    if (rowDiff <= 1 && colDiff <= 1) {
        console.log("Valid king move");
        return true;
    }

    console.log("Invalid king move: more than one square");
    return false;
};