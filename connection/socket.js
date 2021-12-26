import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class Socket {
	constructor(server) {
		this.io = new Server(server, {
			cors: {
				origin: '*',
			},
		});

		this.io.use((socket, next) => {
			// 토큰이 없다면 에러를 던져주고 소켓이 처리되지 않도록
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(new Error('Authentication error'));
			}
			//  유효한 토큰이 아니라면 에러를 던져주고 소켓이 처리되지 않도록
			jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
				if (error) {
					return next(new Error('Authentication error'));
				}
				next();
			});
		});

		//  on을 통해서 connection(연결)됐는지 확인
		this.io.on('connection', (socket) => {
			console.log('Socket client connected');
		});
	}
}

let socket;
//  최초 한번 클래스에 해당하는 인스턴트를 만든다
export function initSocket(server) {
	// socket이 존재하지 않으면 새로운 socket을 만들어준다
	if (!socket) {
		socket = new Socket(server);
	}
}

// socket을 사용하는 쪽에서 getSocketIO를 호출하면 가지고 있는 클래스의 io를 전달해줌
export function getSocketIO() {
	if (!socket) {
		throw new Error('Please call init first');
	}
	return socket.io;
}
