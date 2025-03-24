import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from "http"
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer  } from 'socket.io';
import authRoute from './routes/authRoute';
import authMiddleware from './middlewares/authMiddleware';
import socketServerInitialize from './socket/socketServerInitialize';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/auth', authRoute);
app.use("/api",authMiddleware);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/login.html'))
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/register.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/home.html'));
});

app.get('/inmatch', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/match.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/login.html'));
});

socketServerInitialize(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

