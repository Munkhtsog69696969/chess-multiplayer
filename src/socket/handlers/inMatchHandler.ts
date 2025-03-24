import { Socket, Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { getInMatchUsers, getInMatchPairs, getOpponentSocketId } from "../gameStates/inMatchUsers";
import { Action, isUsersTurn } from "../gameStates/chessActions";
import { getMatchActions, pushActionToMatchActions, getMatchActionsByUserId } from "../gameStates/chessActions";
import { chessBoardBuilder } from "../gameFunctions/chessBoardBuilder";
import { isValidMove } from "../validators/chessMoveValidator";

const prisma = new PrismaClient();

const inMatchHandler = async (socket: Socket, io:SocketIOServer, action:Action) => {
    console.log("In match action!");
    const userId=socket.data.userId

    try{
        const user=await prisma.user.findUnique({
            where: {id:userId},
        })

        if(user && !user.inMatch){
            console.log("User is not in match")
            socket.emit("in_match_error",{
                message:"You are not in match!",
                code:"not_in_match"
            })
            return new Error("User us not in match")
        }

        const inMatchUsers=getInMatchUsers();
        const inMatchPairs=getInMatchPairs();

        const isInMatchUsers = inMatchUsers.some(user => user.userId === userId);
        const isInMatchPairs = inMatchPairs.some(pair => pair.user1Id === userId || pair.user2Id === userId);

        if(!isInMatchUsers || !isInMatchPairs){
            console.log("User is not in match users or pairs!")
            socket.emit("in_match_error",{
                message:"You are not in in match users or pairs!",
                code:"not_in_game_state"
            })
            return new Error("User is not in match users or pairs!")
        }

        const myTurn=isUsersTurn(userId)

        if(!myTurn){

            socket.emit("in_match_error",({
                code:"not_your_turn",
                message:"Its not your turn!"
            }))

            return
        }

        const matchActions=getMatchActionsByUserId(userId)

        if(!matchActions){
            socket.emit("in_match_error",({
                code:"no_match_actions",
                message:"There is no match Actions!"
            }))
            return
        }

        const isWhite=matchActions.user1Id==userId

        const chessBoard=chessBoardBuilder(matchActions)

        const validMove=isValidMove(action,chessBoard,isWhite)

        if(!validMove){
            socket.emit("in_match_error", {
                code: "invalid_move",
                message: "The move is invalid!"
            });

            return;
        }

        pushActionToMatchActions(userId,action)

        const updatedMatchActions=getMatchActionsByUserId(userId)
        
        if (!updatedMatchActions) {
            socket.emit("in_match_error", {
                code: "no_updated_match_actions",
                message: "There are no updated match actions!"
            });
            return;
        }

        const updatedChessBoard = chessBoardBuilder(updatedMatchActions);

        const opponentSocketId=getOpponentSocketId(userId)

        if(opponentSocketId){
            io.to(opponentSocketId).emit("move_made",({
                chessboard:updatedChessBoard
            }))

            socket.emit("move_made",({
                chessboard:updatedChessBoard
            }))
        }

    }catch(err){
        console.log("In match error:",err)
    }
};

export default inMatchHandler;