import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { connectDB } from './database/database.js';
// import { db } from './db/database.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
	res.sendStatus(404);
});

app.use((error, req, res, next) => {
	console.error(error);
	res.sendStatus(500);
});

// connectDB 함수를 이용해 연결을 시켜준 뒤, 연결이 된다면 서버를 열어준다
connectDB()
	.then(() => {
		const server = app.listen(config.host.port);
		initSocket(server);
	})
	.catch(console.error);

// app이 실행되기 전에 db에 먼저 연결해두어야 함
// db.getConnection().then((connection) => console.log(connection)); // 연결된 db의 정보가 console로 찍힘
// const server = app.listen(config.host.port);

// 서버나 프론트에서 제일 처음 속한 파일의 만들어진 서버를 socket에 넣어
// 새로운 socket server를 만들어준다
// initSocket(server);
