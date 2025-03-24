export enum ChessPiece {
    WhiteKing = "♔",
    WhiteQueen = "♕",
    WhiteRook = "♖",
    WhiteBishop = "♗",
    WhiteKnight = "♘",
    WhitePawn = "♙",
    BlackKing = "♚",
    BlackQueen = "♛",
    BlackRook = "♜",
    BlackBishop = "♝",
    BlackKnight = "♞",
    BlackPawn = "♟"
}

export interface Action {
    chess_piece: ChessPiece;
    from_square: string;
    to_square: string;
    by: string;
}

export interface MatchAction {
    matchId: string;
    user1Id: string;
    user2Id: string;
    actions: Action[];
}

let matchActions: MatchAction[] = [];

// Function to add a new match action
export const addAction = (matchAction: MatchAction) => {
    matchActions.push(matchAction);
};

// Function to push an action to the match actions
export const pushActionToMatchActions = (userId: string, action: Action) => {
    for(const matchAction of matchActions){
        if(matchAction.user1Id==userId || matchAction.user2Id==userId){
            matchAction.actions.push(action)
        }
    }
};

// Function to get all match actions
export const getMatchActions = (): MatchAction[] => {
    return matchActions;
};

// Function to get match actions by matchId
export const getMatchActionsByMatchId = (matchId: string): MatchAction | undefined => {
    return matchActions.find(matchAction => matchAction.matchId === matchId);
};

export const getMatchActionsByUserId =(userId:string) : MatchAction | undefined=>{
    for(const matchAction of matchActions){
        if(matchAction.user1Id==userId || matchAction.user2Id==userId){
            return matchAction
        }
    }
}

export const isUsersTurn=(userId:string):boolean=>{

    for (const matchAction of matchActions) {
        if (matchAction.user1Id === userId || matchAction.user2Id === userId) {
            const isUser1Turn = matchAction.actions.length % 2 === 0 && matchAction.user1Id === userId;
            const isUser2Turn = matchAction.actions.length % 2 === 1 && matchAction.user2Id === userId;

            if (isUser1Turn || isUser2Turn) {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}