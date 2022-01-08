import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

// 서버가 과부화 되지 않게 지켜주는 거름망
export default limiter = {
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.max, // ip별 요청횟수 100제한
	keyGenerator: (req, res) => 'dwitter',
};
