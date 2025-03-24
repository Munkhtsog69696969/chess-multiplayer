export interface OnlineUser {
    userId:string;
    socketId:string;   
}

let onlineUsers:OnlineUser[] = [];

export const addUser = (user: OnlineUser) => {
    onlineUsers.push(user);
};

export const updateUserSocketId=(userId:string,newSocketId:string)=>{
    const user = onlineUsers.find(user => user.userId === userId);
    if (user) {
        console.log("In match socket id is updated! ",
            "userId: ",userId, 
            "old socket id: ",user.socketId,
            "new socket id: ",newSocketId
        )

        user.socketId = newSocketId;
    }
}

export const removeUser = (socketId: string) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

export const getOnlineUsers = () => {
    return onlineUsers;
};