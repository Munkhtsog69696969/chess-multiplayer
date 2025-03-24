export interface MatchmakingUser {
    userId:string;
    socketId:string;
}

let matchmakingUsers:MatchmakingUser[] = [];

export const addMatchmakingUser = (user:MatchmakingUser) => {
    matchmakingUsers.push(user);
};

export const updateMatchmakingUserSocketId = (userId: string, newSocketId: string) => {
    const user = matchmakingUsers.find(user => user.userId === userId);
    if (user) {

        console.log("In match socket id is updated! ",
            "userId: ",userId, 
            "old socket id: ",user.socketId,
            "new socket id: ",newSocketId
        )

        user.socketId = newSocketId;
    }
};

export const removeMatchmakingUser = (socketId:string) => { 
    matchmakingUsers = matchmakingUsers.filter((user) => user.socketId !== socketId);
}

export const getMatchmakingUsers = () => {
    return matchmakingUsers;
}