import MongoDb from 'mongodb';
import { config } from '../config.js';

let db;
export async function connectDB() {
	// mongodb의 MongoClient에 있는 connect를 이용해 host URL을 연결해준다
	return (
		MongoDb.MongoClient.connect(config.db.host) //
			// 연결이 되면 연결된 client를 받아서 그안에있는 db를 변수에 담아준다
			.then((client) => {
				db = client.db();
			})
	);
}

// user에 대한 collection을 가지고 오는 함수
export function getUsers() {
	return db.collection('users');
}

// tweet에 대한 collection을 가지고 오는 함수
export function getTweets() {
	return db.collection('tweets');
}
