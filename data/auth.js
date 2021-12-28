import { getUsers } from '../database/database.js';
import MongoDb from 'mongodb';

// mongodb에 id가 오브젝트 형식으로 저장 되어 있기 때문에
// mongodb의 ObjectId를 받아와서 ObjectId 변수에 저장
const ObjectId = MongoDb.ObjectId;

export async function findByUsername(username) {
	// database에 만들어 놓은 getUsers 함수를 이용해 bd를 가지고 와서
	return (
		getUsers()
			// findOne(하나의 doc을 찾아오는 내장함수)으로 username이 username인 doc을 찾아온다
			.findOne({ username })
			.then(mapOptionalUser)
	);
}

export async function findById(id) {
	// database에 만들어 놓은 getUsers 함수를 이용해 bd를 가지고 와서
	return (
		getUsers()
			// findOne(하나의 doc을 찾아오는 내장함수)으로 username이 username인 doc을 찾아온다
			.findOne({ _id: new ObjectId(id) })
			.then(mapOptionalUser)
	);
}

export async function createUser(user) {
	return getUsers()
		.insertOne(user)
		.then((data) => data.insertedId.toString());
}

// 찾은 유저가 있으면 유저의 _id를 새로운 id에 넣어서 반환
// 찾은 유저가 없다면 비어있는 user(null) 반환
function mapOptionalUser(user) {
	return user ? { ...user, id: user._id.toString() } : user;
}
