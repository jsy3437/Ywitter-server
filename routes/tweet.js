import express from 'express';
import fs, { readFile } from 'fs';

const tweetJson = fs.readFileSync('./public/tweetData.json', 'utf-8');

const tweetList = JSON.parse(tweetJson);

const router = express.Router();

// const tweetList = tweetBuffer.toString();
// console.log(tweetList);

router.use(express.json());

router.get('/', (req, res) => {
	const username = req.query.username;

	if (!!req.query.username) {
		let filterList = tweetList.filter((el) => {
			return el.username === username;
		});

		return res.status(200).send({ success: true, filterList });
	} else {
		return res.status(200).send(tweetList);
	}
});

router.post('/', (req, res) => {
	// id를 배열의 마지막 id를 찾아서 +1한 값으로 바꾸기
	let date = new Date();
	const dateJson = date.toJSON();
	console.log(dateJson);
	const body = req.body;
	const newList = [
		{
			id: tweetList.length,
			text: body.text,
			createAt: dateJson,
			name: body.name,
			username: body.username,
			url: body.url ? body.url : '',
		},
	];

	const newTweet = tweetList.concat(newList);
	const jsonWrite = JSON.stringify(newTweet);

	console.log(tweetList.concat(newList));

	fs.writeFile('./public/tweetData.json', jsonWrite, (err) => {
		if (err) {
			return console.log(err);
		} else {
			console.log('success!');
		}
	});

	return res.status(201).send({ success: true, newTweet });
});

router.put('/:id', (req, res) => {
	const body = req.body;
	const id = req.params.id;

	tweetList.find((el) => {
		if (el.id === Number(id)) {
			el.text = body.text;
		}
	});

	const jsonWrite = JSON.stringify(tweetList);

	fs.writeFile('./public/tweetData.json', jsonWrite, (err) => {
		if (err) {
			return console.log(err);
		} else {
			console.log('success!');
		}
	});

	// return res.status(200).send({ success: true, tweetList });
});

router.delete('/:id', (req, res) => {
	const id = req.params.id;

	const newTweet = tweetList.filter((el) => {
		return el.id !== Number(id);
	});
	console.log(newTweet);

	// tweetList.splice(id, 1);
	const jsonWrite = JSON.stringify(tweetList);

	// console.log(tweetList);
	fs.writeFile('./public/tweetData.json', jsonWrite, (err) => {
		if (err) {
			return console.log(err);
		} else {
			console.log('success!');
		}
	});

	return res.status(204).send({ success: true, tweetList });
});

export default router;
