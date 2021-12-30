import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

// 에러메세지 변수 처리
const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!(authHeader && authHeader.startsWith('Bearer '))) {
		return res.status(401).json(AUTH_ERROR);
	}

	const token = authHeader.split(' ')[1];
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
