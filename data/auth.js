import { useVirtualId } from '../database/database.js';
import Mongoose from 'mongoose';

// user의 스키마 작성
const userSchema = new Mongoose.Schema({
	username: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	url: String,
});

// _id를 id로 변환하는 함수
useVirtualId(userSchema);

// model
const User = Mongoose.model('User', userSchema);

// 가상의 id를 database에서 추가 해주었기 때문에 코드가 간단해진다

export async function findByUsername(username) {
	return User.findOne({ username });
}

export async function findById(id) {
	return User.findById(id);
}

export async function createUser(user) {
	return new User(user).save().then((data) => data.id);
}
