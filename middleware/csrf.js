import { config } from '../config.js';
import bcrypt from 'bcrypt';

// 무언가 변경하는 요청인지 확인
export const csrfCheck = (req, res, next) => {
	// 무언가 변경하지 않는 요청이라면
	if (
		req.method === 'GET' ||
		req.method === 'OPTION' ||
		req.method === 'HEAD'
	) {
		return next();
	}

	// 무언가 변경하는 요청이라면
	//  헤더에 csrf 토큰을 가지고 있는지
	const csrfHeader = req.get('_csrf-token');

	// 토큰을 가지고 있지 않다면
	if (!csrfHeader) {
		console.warn('Missing required "_csrf-token" header.', req.header.origin);
		return res.status(403).json({ massage: 'Failed CSRF check' });
	}

	validateCsrfToken(csrfHeader)
		.then((valid) => {
			// 토큰이 유효하지 않다면
			if (!valid) {
				console.warn(
					'Value provided in "_csrf-token" header does not validate',
					req.headers.origin,
					csrfHeader
				);
				return res.status(403).json({ massage: 'Failed CSRF check' });
			}
			// 유효한 토큰이라면 next
			next();
		})
		// 혹시 에러가 발생한다면
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ message: 'Something went wrong' });
		});
};

async function validateCsrfToken(csrfHeader) {
	// bcrypt의 compare를 이용해 우리가 가지고 있는 토큰과 헤더에 있는 토큰을 비교해주는 함수이다
	return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
