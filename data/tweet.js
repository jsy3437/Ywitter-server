import { db } from '../db/database.js';
import { getTweets } from '../database/database.js';
import MongoDb from 'mongodb';
import * as userRepository from './auth.js';

// NO SQL : 데이터의 관계보다는 정보의 중복으로
// 모든 사용자가 트윗을 쿼리하는 횟수가 사용자의 정보를 업데이트하는 횟수보다 많다
// 프로필DB 따로 사용자의 문서 DB 따로
// 수평확징성이 좋다
// 관계형 조인쿼리는 가능은 하지만 성능이 좋지 않다

// SQL : 데이터의 관계형
// 조인쿼리의 성능이 좋다
// 데이터의 관계를 이용해 중복으로 저장 할 필요없이 연결해 사용한다

const ObjectId = MongoDb.ObjectId;

export async function getAll() {
	return (
		getTweets()
			.find()
			// 정렬 createAt 기준으로 나중에 만들어진 순서(거꾸로)
			.sort({ createAt: -1 })
			// 배열 형태로 변환
			.toArray()
			.then(mapTweets)
	);
}

export async function getAllByUsername(username) {
	return (
		getTweets()
			.find({ username })
			// 정렬 createAt 기준으로 나중에 만들어진 순서(거꾸로)
			.sort({ createAt: -1 })
			// 배열 형태로 변환
			.toArray()
			.then(mapTweets)
	);
}

export async function getById(id) {
	// database에 만들어 놓은 getUsers 함수를 이용해 bd를 가지고 와서
	return (
		getTweets()
			// findOne(하나의 doc을 찾아오는 내장함수)으로 username이 username인 doc을 찾아온다
			.findOne({ _id: new ObjectId(id) })
			.then(mapOptionalTweet)
	);
}

export async function create(text, userId) {
	// user의 정보도 같이 넣기 위해 userId 이용해 찾은 데이터들을 변수에 담는다
	const { name, username, url } = await userRepository.findById(userId);

	// user에서 찾은 데이터와 새로운 text, createAt들을 넣어 tweet 쿼리를 만든다
	const tweet = {
		text,
		createdAt: new Date(),
		userId,
		name,
		username,
		url,
	};

	return getTweets()
		.insertOne(tweet)
		.then((data) => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

export async function update(id, text) {
	// findOne은 아무것도 리턴하지 않게때문에 findOneAndUpdate를 사용
	return (
		getTweets()
			.findOneAndUpdate(
				{ _id: new ObjectId(id) },
				// $set => 업데이트
				{ $set: { text } },
				// returnDocument 옵션을 명시하지 않으면 업데이트 전상태의 데이터를 리턴하므로,
				// 업데이트 후의 데이터를 원하면 꼭 after를 명시해주어야한다
				{ returnDocument: 'after' }
			)
			// result 속의 value에 결과값이 들어있다
			.then((result) => result.value)
			// id가 포함 될 수 있게 만들어 준다
			.then(mapOptionalTweet)
	);
}

export async function remove(id) {
	// deleteOne => 삭제
	return getTweets().deleteOne({ _id: new Object(id) });
}

function mapOptionalTweet(tweet) {
	// tweet 요소를 받아서 id가 포함된 객체로 만들어 준다
	return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
	// tweet 배열을 받아서 각 객체에 id가 포함된 배열로 만들어 준다
	return tweets.map(mapOptionalTweet);
}
