import { db } from '../db/database.js';

// execute => mysql을 실행하는 함수

export async function findByUsername(username) {
	return (
		db
			// 데이터를 찾아옴 => SELECT , 모든데이터 => *, 어떤폼에서=> FROM, 조건 => WHERE,
			// db의 user에서 username이 username인 데이터를 가지고 오겠다
			.execute('SELECT * FROM users WHERE username=?', [username])
			.then((result) => result[0][0])
	);
}

export async function findById(id) {
	return (
		db
			// 데이터를 찾아옴 => SELECT , 모든데이터 => *, 어떤폼에서=> FROM, 조건 => WHERE,
			// db의 user에서 id가 id인 데이터를 가지고 오겠다
			.execute('SELECT * FROM users WHERE id=?', [id])
			.then((result) => result[0][0])
	);
}

export async function createUser(user) {
	const { username, password, name, email, url } = user;
	return db
		.execute(
			// 데이터를 새로만듬 => INSERT INTO
			'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)',
			[username, password, name, email, url]
		)
		.then((result) => result[0].insertId);
}
