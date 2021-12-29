import Mongoose from 'mongoose';
import { config } from '../config.js';

export async function connectDB() {
	// mongoose의 connect에 host를 전달해준다
	return Mongoose.connect(config.db.host);
}

export function useVirtualId(schema) {
	// 가상의 id를 추가해서 사용자가 _id를 읽어올때는
	// 오브젝트 타입을 문자로 변환하여 id로 읽어온다
	schema.virtual('id').get(function () {
		return this._id.toString();
	});

	// 옵션을 넣어주지 않으면 json이나 log를 찍을때 포함되지 않는다

	// json으로 변환 할 때 포함 될 수 있게 옵션을 넣어준다
	schema.set('toJSON', { virtuals: true });
	// console.log를 찍을 때 포함 될 수 있게 옵션을 넣어준다
	schema.set('toOject', { virtuals: true });
}

// TODO(uni): Delete blow

let db;

// tweet에 대한 collection을 가지고 오는 함수
export function getTweets() {
	return db.collection('tweets');
}
