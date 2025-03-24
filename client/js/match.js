document.addEventListener("DOMContentLoaded", () => {
    const chessboard = document.getElementById("chessboard");

    createChessboard(chessboard);
    placeChessPieces();

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const button = document.createElement("button");
    button.id = "button";
    button.textContent = "Make Move";
    buttonContainer.appendChild(button);

    const chessboardContainer = document.querySelector(".chessboard");
    chessboardContainer.insertBefore(buttonContainer, chessboard);

    button.addEventListener("click", () => {
        if (window.socket) {
            console.error("Socket initialized");
        }
    });
});

function createChessboard(chessboard) {
    const rows = 8;
    const cols = 8;
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    chessboard.innerHTML = "";

    chessboard.style.display = "flex";
    chessboard.style.flexWrap = "wrap";
    chessboard.style.width = "400px";
    chessboard.style.height = "400px";

    const squareSize = 400 / 8;

    for (let row = rows; row >= 1; row--) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement("div");
            square.id = `${letters[col]}${row}`;
            square.classList.add("square");
            square.style.width = `${squareSize}px`;
            square.style.height = `${squareSize}px`;
            square.style.backgroundColor = (row + col) % 2 === 0 ? "white" : "gray";

            square.dataset.row = row;
            square.dataset.col = letters[col];

            square.addEventListener("click", () => {
                handleSquareClick(square);
            });

            chessboard.appendChild(square);
        }
    }
}

// Unicode chess piece symbols
const pieces = {
    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙"
    },
    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟"
    }
};

function placeChessPieces() {
    const initialSetup = {
        "a1": pieces.white.rook, "b1": pieces.white.knight, "c1": pieces.white.bishop, "d1": pieces.white.queen,
        "e1": pieces.white.king, "f1": pieces.white.bishop, "g1": pieces.white.knight, "h1": pieces.white.rook,
        "a2": pieces.white.pawn, "b2": pieces.white.pawn, "c2": pieces.white.pawn, "d2": pieces.white.pawn,
        "e2": pieces.white.pawn, "f2": pieces.white.pawn, "g2": pieces.white.pawn, "h2": pieces.white.pawn,

        "a8": pieces.black.rook, "b8": pieces.black.knight, "c8": pieces.black.bishop, "d8": pieces.black.queen,
        "e8": pieces.black.king, "f8": pieces.black.bishop, "g8": pieces.black.knight, "h8": pieces.black.rook,
        "a7": pieces.black.pawn, "b7": pieces.black.pawn, "c7": pieces.black.pawn, "d7": pieces.black.pawn,
        "e7": pieces.black.pawn, "f7": pieces.black.pawn, "g7": pieces.black.pawn, "h7": pieces.black.pawn
    };

    Object.keys(initialSetup).forEach(squareId => {
        const square = document.getElementById(squareId);
        if (square) {
            square.textContent = initialSetup[squareId];
            square.style.fontSize = "40px";
            square.style.textAlign = "center";
            square.style.lineHeight = "50px";
        }
    });
}

let selectedSquare = null;

function handleSquareClick(square) {
    if (!selectedSquare) {
        // Only allow selecting squares with pieces
        if (square.textContent) {
            selectedSquare = square;
            square.style.border = "2px solid red";
        }
    } else {
        const fromSquareId = selectedSquare.id;
        const toSquareId = square.id;
        const piece = selectedSquare.textContent; // Get the piece symbol

        selectedSquare.style.border = "";
        selectedSquare = null;

        if (window.socket) {
            window.socket.emit("in_match_action", {
                chess_piece: piece,
                from_square: fromSquareId,
                to_square: toSquareId,
                by: "player1"
            });
        }
    }
}

function updateChessboard(chessboard) {
    console.log("Updating chessboard with data:", chessboard);
    
    const container = document.getElementById("chessboard");
    if (!container) {
        console.error("Chessboard container not found");
        return;
    }

    if (!chessboard || !Array.isArray(chessboard)) {
        console.error("Invalid chessboard data received:", chessboard);
        return;
    }

    for (let row = 0; row < chessboard.length; row++) {
        for (let col = 0; col < chessboard[row].length; col++) {
            const piece = chessboard[row][col];
            const squareId = `${String.fromCharCode(97 + col)}${8 - row}`;
            const square = document.getElementById(squareId);
            if (square) {
                square.textContent = piece ? piece : "";
                square.style.fontSize = "40px";
                square.style.textAlign = "center";
                square.style.lineHeight = "50px";
            }
        }
    }
}