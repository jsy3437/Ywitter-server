import { config } from '../config.js';
import SQ from 'sequelize';

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
	host,
	dialect: 'mysql', // 기본값이 mysql이라 생략이 가능하지만 명시해줌
	logging: false, // logging을 false로 주면 데이터베이스 실행한 정보가 log로 남지 않는다
});
