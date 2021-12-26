import { sequelize } from '../db/database.js';
import SQ from 'sequelize';
import { User } from './auth.js';

// sequelize 안에 있는 DataTypes를 받아온다
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

// sequelize의 define을 이용해 우리가 만든 tweet의 스키마 연결
const Tweet = sequelize.define('tweet', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	text: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});
// Tweet은 User에 전속(포함)된다 => tweet과 user를 이어준다
Tweet.belongsTo(User);

const INCLUDE_USER = {
	attributes: [
		'id',
		'text',
		'createdAt',
		'userId',
		// sequelize의 colum속에 있는 user의 name을 가지고 와서 name으로 넣어준다
		[Sequelize.col('user.name'), 'name'], // 'name' 자리에 데이터 이름을 정해서 넣으면 중첩으로 											들어가지 않는다
		[Sequelize.col('user.username'), 'username'],
		[Sequelize.col('user.url'), 'url'],
	],
	include: {
		model: User,
		attributes: [],
	},
};

const ORDER_DESC = {
	// data array 안의 순서 => createdAt을 기준으로 DESC(거꾸로) 정렬
	order: [['createdAt', 'DESC']],
};

export async function getAll() {
	// 변수에 정의된 내용 그대로 가져다쓰기
	return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
	// 변수에 정의된 내용 + include속성에 where(조건) 추가
	return Tweet.findAll({
		...INCLUDE_USER,
		...ORDER_DESC,
		include: {
			...INCLUDE_USER.include,
			where: { username },
		},
	});
}

export async function getById(id) {
	return Tweet.findOne({
		where: { id },
		...INCLUDE_USER,
	});
}

export async function create(text, userId) {
	// text와 userId로 tweet을 만들고,
	// 만들어진 tweet의 id를 이용해 해당 tweet의 정보를 가지고 온다
	return Tweet.create({ text, userId }).then((data) => {
		this.getById(data.dataValues.id);
	});
}

export async function update(id, text) {
	// primary key로 id를 이용해 찾은 뒤,
	// INCLUDE_USER 형식으로 데이터를 받아온다
	return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
		// 받아온 데이터(tweet)의 text를 새로운 text로 바꿔준뒤
		tweet.text = text;
		// 그대로 db에 저장(update) 해준다
		return tweet.save();
	});
}

export async function remove(id) {
	// primary key로 id를 이용해 찾은 뒤, 데이터를 받아온다
	return Tweet.findByPk(id).then((tweet) => {
		// 해당 데이터(data)를 삭제(destroy) 해준다
		tweet.destroy();
	});
}
