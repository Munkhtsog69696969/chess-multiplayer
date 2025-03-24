import { Socket, Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { addMatchmakingUser, removeMatchmakingUser, getMatchmakingUsers } from "../gameStates/matchMakingUsers";
import { addInMatchUser, removeInMatchUser, getInMatchUsers,
    addInMatchPair, removeInMatchPair, getInMatchPairs
} from "../gameStates/inMatchUsers";
import { addAction, getMatchActions } from "../gameStates/chessActions";

const prisma = new PrismaClient();

const timeoutTime=15*1000

const matchmakingHandler = async (socket: Socket, io:SocketIOServer) => {
    console.log("Client connected to matchmaking");
    const userId=socket.data.userId

    try {
        const user=await prisma.user.findUnique({
            where : {id:userId}
        })

        if(user && user.inMatch){
            console.log("User is already in match!")
            socket.emit("matchmaking_error",{
                message:"You already in a match!",
                code:"in_match"
            })
            return new Error("User is already in match!")
        }

        if(user && user.matchmaking){
            return new Error("User is already in matchmaking!")
        }

        await prisma.user.update({
            where : { id:userId },
            data : { matchmaking:true}
        })

        addMatchmakingUser({userId:userId , socketId: socket.id})

        const start=performance.now()

        //60 seconds matchmaking timeout
        const timeout=setTimeout(async()=>{
            try{
                clearInterval(interval)
                console.log("Matchmaking timed out")

                socket.emit("matchmaking_error",{
                    message:"Matchmaking timed out!",
                    code:"timed_out"
                })

                await prisma.user.update({
                    where: { id:userId},
                    data : {matchmaking:false}
                })

                removeMatchmakingUser(socket.id)
            }catch(err){
                console.log("Error canceling matchmaking",err)
            }
        },timeoutTime)

        const interval=setInterval(()=>{
            const timeLeftInSeconds=Math.floor((timeoutTime - (performance.now() - start))/1000)
            console.log(timeLeftInSeconds)
            socket.emit("matchmaking_timer",`Finding match ${timeLeftInSeconds}`)
        },1000)
        

        //If succesful clear timeout and user found a match
        const matchMakingUsers = getMatchmakingUsers().filter(user => user.socketId !== socket.id);
        for (const opponent of matchMakingUsers){
            const opponentUser=await prisma.user.findUnique({
                where:{id:opponent.userId}
            })

            if(!opponentUser?.inMatch && opponentUser?.matchmaking){
                clearInterval(interval)
                clearTimeout(timeout)

                //update both user's fields in database
                await prisma.user.update({
                    where: {id:userId},
                    data : {inMatch:true, matchmaking:false}
                })

                await prisma.user.update({
                    where: {id:opponent.userId},
                    data : {inMatch:true, matchmaking:false}
                })

                //remove from matchmaking
                removeMatchmakingUser(opponent.socketId)
                removeMatchmakingUser(socket.id)
                //add to in match users
                addInMatchUser({userId:opponent.userId, socketId:opponent.socketId})
                addInMatchUser({userId:userId, socketId:socket.id})
                //add to in match pairs
                addInMatchPair({
                    user1Id:userId,
                    user2Id:opponent.userId,
                    user1SocketId:socket.id,
                    user2SocketId:opponent.socketId
                })

                //create match and userMatches
                const match=await prisma.match.create({
                    data: {
                        duration: 0,
                        moves: [],
                        users: {
                            create: [
                                { user: { connect: { id: userId } } },
                                { user: { connect: { id: opponent.userId } } }
                            ]
                        }
                    },
                    include: {
                        users: true
                    }
                })

                addAction({
                    matchId:match.id,
                    user1Id:userId,
                    user2Id:opponent.userId,
                    actions:[]
                })

                //send match found to its opponent
                io.to(opponent.socketId).emit("match_found",{
                    fromUserId:userId,
                    fromSocketId:socket.id,
                    toUserId:opponent.userId,
                    toSocketId:opponent.socketId
                })

                io.to(socket.id).emit("match_found", {
                    fromUserId: opponent.userId,
                    fromSocketId: opponent.socketId,
                    toUserId: userId,
                    toSocketId: socket.id
                });

                break
            }
        }



    } catch (err) {
        console.error("Error in matchmakingHandler:", err);
    }
};

export default matchmakingHandler;