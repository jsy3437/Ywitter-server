import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

// 에러메세지 변수 처리
const AUTH_ERROR = { message: 'Authentication Error' };

// 헤더에 토큰 유무 검사 후 없으면 에러, 있으면 토큰이 유효한지 유효하지 않는지 검사
export const isAuth = async (req, res, next) => {
	// 헤더에 토큰 유무 검사 (없으면 브라우저 클라이언트일 경우)
	// 쿠키에 토큰 유무 검사 (둘다 없다면 허용안함)

	let token;
	// 헤더검사
	const authHeader = req.get('Authorization');
	// 헤더에 토큰이 있다면
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.split(' ')[1];
	}

	// 헤더에도 토큰이 없다면
	if (!token) {
		// 쿠키를 검사한다
		token = req.cookies['token'];
	}

	// 쿠키에도 없다면 401을 보낸다
	if (!token) {
		return res.status(401).json(AUTH_ERROR);
	}

	// TODO: Make it secure!
	jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
		if (error) {
			return res.status(401).json(AUTH_ERROR);
		}
		const user = await userRepository.findById(decoded.id);
		if (!user) {
			return res.status(401).json(AUTH_ERROR);
		}
		req.userId = user.id; // req.customData
		req.token = token;
		next();
	});
};
