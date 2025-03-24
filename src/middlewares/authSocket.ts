import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

const authSocket = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.headers.cookie?.split("=")[1];
        if (!token) {
            return next(new Error("Authorization token is missing"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your secret key") as JwtPayload;
        socket.data.userId = decoded.userId;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
};

export default authSocket;