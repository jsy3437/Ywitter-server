import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';
// import { db } from './db/database.js';

const app = express();

const corsOption = {
	origin: config.cors.allowedOrigin,
	optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
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

// sync => 데이터베이스에 연결해서 우리 모델과 우리 모델의 스키마가 데이터베이스 스키마가 존재하는지,
// 			존재하지 않는다면 테이블을 새로 만들어주는 역할을 함
sequelize.sync().then(() => {
	console.log(`Server is started...${new Date()}`);
	// sequelize에 연결이 잘 되었다면 서버를 실행한다
	const server = app.listen(config.port);
	initSocket(server);
});

// app이 실행되기 전에 db에 먼저 연결해두어야 함
// db.getConnection().then((connection) => console.log(connection)); // 연결된 db의 정보가 console로 찍힘
// const server = app.listen(config.host.port);

// 서버나 프론트에서 제일 처음 속한 파일의 만들어진 서버를 socket에 넣어
// 새로운 socket server를 만들어준다
// initSocket(server);
