import { config } from '../config.js';
import mysql from 'mysql2';

// 데이터베이스를 관리하는 pool을 만든다, createPool을 이용해 mysql접속
const pool = mysql.createPool({
	host: config.db.host, // 호스트 주소
	user: config.db.user, // 사용자의 이름
	database: config.db.database, // 데이터베이스 이름
	password: config.db.password, // 설정한 비밀번호
});

//  pool에 있는 promise를 이용해 비동기로 내보낸다
export const db = pool.promise();
