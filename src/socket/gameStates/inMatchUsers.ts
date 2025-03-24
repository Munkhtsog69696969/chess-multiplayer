export interface InMatchUser {
    userId: string;
    socketId: string;
}

export interface InMatchPair {
    user1Id: string;
    user1SocketId: string;
    user2Id: string;
    user2SocketId: string;
}

let inMatchUsers: InMatchUser[] = [];
let inMatchPairs: InMatchPair[] = [];

// InMatch user functions 
export const addInMatchUser = (user: InMatchUser) => {
    inMatchUsers.push(user);
};

export const updateInMatchUserSocketId = (userId: string, newSocketId: string) => {
    const user = inMatchUsers.find(user => user.userId === userId);
    if (user) {
        console.log("In match socket id is updated! ",
            "userId: ",userId, 
            "old socket id: ",user.socketId,
            "new socket id: ",newSocketId
        )

        user.socketId = newSocketId;
    }
};

export const removeInMatchUser = (socketId: string) => {
    inMatchUsers = inMatchUsers.filter((user) => user.socketId !== socketId);
};

export const getInMatchUsers = () => {
    return inMatchUsers;
};

// InMatch pair functions
export const addInMatchPair = (pair: InMatchPair) => {
    inMatchPairs.push(pair);
};

export const updateInMatchPair = (userId: string, newSocketId: string) => {
    const pair = inMatchPairs.find(pair => pair.user1Id === userId || pair.user2Id === userId);

    if (pair) {
        if (pair.user1Id === userId) {
            pair.user1SocketId = newSocketId;
        } else if (pair.user2Id === userId) {
            pair.user2SocketId = newSocketId;
        }
    }
};

export const removeInMatchPair = (userId: string) => {
    inMatchPairs = inMatchPairs.filter(pair => pair.user1Id !== userId && pair.user2Id !== userId);
};

export const getOpponentSocketId=(userId:string)=>{
    for(const inMatchPair of inMatchPairs){
        if(inMatchPair.user1Id==userId){
            return inMatchPair.user2SocketId
        }

        if(inMatchPair.user2Id==userId){
            return inMatchPair.user1SocketId
        }
    }
}

export const getInMatchPairs = () => {
    return inMatchPairs;
};