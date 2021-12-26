import { sequelize } from '../db/database.js';
import SQ from 'sequelize';

// sequelize 안에 있는 DataTypes를 받아온다
const DataTypes = SQ.DataTypes;

// sequelize의 define을 이용해 우리가 만든 유저의 스키마 연결
// 인자로 'user'를 넣어주면 자동으로 테이블이 생성된다
export const User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.INTEGER, // 데이터 타입 (INT)
			autoIncrement: true, // 자동으로 1씩 더해서 id생성
			allowNull: false, // null값 허용안함
			primaryKey: true, // 절대적인 값
		},
		username: {
			type: DataTypes.STRING(45),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		url: DataTypes.TEXT,
	},
	// createAt, updateAt을 만들지 않는다는 옵션
	{ timestamps: false }
);

// sequelize를 사용해 간단하게 작성 할 수 있다
export async function findByUsername(username) {
	// User의 테이블을 이용해 username이 username인 데이터를 찾는다
	// (username: username => 인자가 같으므로 생략)
	return User.findOne({ where: { username } }); // findOne => 하나의 인자로 찾기
}

export async function findById(id) {
	return User.findByPk(id); // findByPk => primary key로 찾기
}

export async function createUser(user) {
	// sequelize.define의 인자로 넣어준 user를 넣어주면 통째로 생성,
	// 생성이 완료되면 만들어진 사용자(data)를 받아서 출력
	return User.create(user).then((data) => {
		data.dataValues.id;
	});
}
