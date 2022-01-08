import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

export async function signup(req, res) {
	const { username, password, name, email, url } = req.body;
	const found = await userRepository.findByUsername(username);
	if (found) {
		return res.status(409).json({ message: `${username} already exists` });
	}
	const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
	const userId = await userRepository.createUser({
		username,
		password: hashed,
		name,
		email,
		url,
	});
	const token = createJwtToken(userId);
	setToken(res, token);
	res.status(201).json({ token, username });
}

export async function login(req, res) {
	const { username, password } = req.body;
	const user = await userRepository.findByUsername(username);
	if (!user) {
		return res.status(401).json({ message: 'Invalid user or password' });
	}
	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res.status(401).json({ message: 'Invalid user or password' });
	}
	const token = createJwtToken(user.id);
	setToken(res, token);
	res.status(200).json({ token, username });
}

export async function logout(req, res, next) {
	res.cookie('token', '');
	res.status(200).json({ message: 'User has been logged out' });
}

function createJwtToken(id) {
	console.log(config.jwt.secretKey);
	return jwt.sign({ id }, config.jwt.secretKey, {
		expiresIn: config.jwt.expiresInSec,
	});
}

// token을 설정하는 함수
function setToken(res, token) {
	// option을 설정하지 않으면 일반 cookie이다
	const options = {
		// 쿠키의 만료시간 (jwt의 만료시간과 똑같이 주는 데 ms기준이기 때문에 *1000을 해준다)
		maxAge: config.jwt.expiresInSec * 1000,
		// http에서만 사용 할 수 있는 cookie
		httpOnly: true,
		// server와 client가 다른 url이어도 동작 할 수 있게 설정
		sameSite: 'none',
		// 다른 url을 허용 할 때에 필수로 줘야함
		secure: true,
	};
	res.cookie('token', token, options); // http only 쿠키
}

export async function me(req, res, next) {
	const user = await userRepository.findById(req.userId);
	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}
	res.status(200).json({ token: req.token, username: user.username });
}

export async function csrfToken(req, res, next) {
	// 비동기적으로 토큰을 만드는 함수를 호출해서 변수에 넣는다
	const csrfToken = await generateCSRFToken();
	// client에게 전달
	res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
	// bcrypt를 이용해 .env의 암호를 1자리의 랜덤한 문자를 넣어 토큰을 만들어주는 함수이다
	return bcrypt.hash(config.csrf.plainToken, 1);
}
