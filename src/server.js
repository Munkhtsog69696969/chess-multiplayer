"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const socketServerInitialize_1 = __importDefault(require("./socket/socketServerInitialize"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
app.use('/api/auth', authRoute_1.default);
app.use("/api", authMiddleware_1.default);
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/register.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/home.html'));
});
app.get('/inmatch', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/match.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/login.html'));
});
(0, socketServerInitialize_1.default)(io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
