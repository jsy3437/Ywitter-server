import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';
import * as userRepository from './auth.js';

// NO SQL : 데이터의 관계보다는 정보의 중복으로
// 모든 사용자가 트윗을 쿼리하는 횟수가 사용자의 정보를 업데이트하는 횟수보다 많다
// 프로필DB 따로 사용자의 문서 DB 따로
// 수평확징성이 좋다
// 관계형 조인쿼리는 가능은 하지만 성능이 좋지 않다

// SQL : 데이터의 관계형
// 조인쿼리의 성능이 좋다
// 데이터의 관계를 이용해 중복으로 저장 할 필요없이 연결해 사용한다

// mongoDB는 스키마가 정해져있지않아 스키마을 일정하게 지키기가 어렵다
// tweet스키마 작성 -> 장점 데이터의 일관성을 지킬 수 있다
const tweetSchema = new Mongoose.Schema(
	{
		text: { type: String, required: true },
		userId: { type: String, required: true },
		name: { type: String, required: true },
		username: { type: String, required: true },
		url: String,
	},
	// timestamps 옵션값을 true로 주면 만든 시간,날짜 자동생성
	{ timestamps: true }
);

// _id를 id호 변환하는 함수
useVirtualId(tweetSchema);

// model
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function getAll() {
	// 모든 tweet을 찾고 createAt 기준 최근 tweet을 앞으로 정렬
	return Tweet.find().sort({ createAt: -1 });
}

export async function getAllByUsername(username) {
	return Tweet.find({ username }).sort({ createAt: -1 });
}

export async function getById(id) {
	return Tweet.findById(id);
}

export async function create(text, userId) {
	// user쪽에서 userId를 이용해 해당 user의 데이터 들을 찾은 뒤
	return userRepository.findById(userId).then((user) =>
		// 새로운 tweet을 만들어서 저장해준다
		new Tweet({
			text,
			userId,
			name: user.name,
			username: user.username,
		}).save()
	);
}

export async function update(id, text) {
	// id를 이용해 tweet을 찾고 새로운 text로 업데이트 (옵션: 원본리턴끄기)
	return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

export async function remove(id) {
	// id를 이용해 tweet을 찾고 해당 tweet을 삭제
	return Tweet.findByIdAndDelete(id);
}
