import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetRouter from './routes/tweet.js';

const app = express();

const corsOptions = {
	origin: ['http://localhost:3000'],
	optionsSuccessStatus: 200,
	credentials: true,
};

app.use(cookieParser());
app.use(morgan('common'));
app.use(cors(corsOptions));
app.use(helmet());

app.use('/tweets', tweetRouter);

app.use((req, res, next) => {
	res.sendStatus(404);
});

app.use((error, req, res, next) => {
	console.error(error);
	res.sendStatus(500);
});

app.listen(8080);
