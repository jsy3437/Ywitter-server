import { db } from '../db/database.js';

// FROM, JOIN => tweets과 JOIN한 users에서 가지고 오고, tweets과 users를 줄여서 tw와 us로 부를 것 이다.
// SELECT => 그 중 tw의 id, text, createAt, userId와 tw의 username, name, url을 가지고 온다.
// ON => tw에 있는 userId가 us에 있는 id와 같을때
// ORDER BY => tw의 createAt을 기준으로 거꾸로(DESC) 정렬하겠다
// 재사용을 위해 변수에 넣어준다
const SELECT_JOIN =
	'SELECT tw.id, tw.text, tw.createAt, tw.userId, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId=us.id';
const ORDER_DESC = 'ORDER BY tw.createAt DESC';

export async function getAll() {
	return db
		.execute(`${SELECT_JOIN} ${ORDER_DESC}`, null) //
		.then((result) => result[0]);
}

export async function getAllByUsername(username) {
	return db
		.execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username])
		.then((result) => result[0]);
}

export async function getById(id) {
	return db
		.execute(`${SELECT_JOIN} WHERE tw.id=?`, [id])
		.then((result) => result[0][0]);
}

export async function create(text, userId) {
	return db
		.execute('INSERT INTO tweets (text, createAt, userId) VALUES(?,?,?)', [
			text,
			new Date(),
			userId,
		])
		.then((result) => getById(result[0].insertId));
}

export async function update(id, text) {
	return (
		db
			// SET => update할 새로운 데이터
			.execute('UPDATE tweets SET text=? WHERE id=?', [text, id])
			.then(() => getById(id))
	);
}

export async function remove(id) {
	return db.execute('DELETE FROM tweets WHERE id=?', [id]);
}
