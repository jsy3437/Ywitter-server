import express from 'express';
import { tweetList } from '../public/tweetData.js';

const router = express.Router();

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
	const body = req.body;
	const newList = {
		id: tweetList.length,
		text: body.text,
		createAt: '',
		name: body.name,
		username: body.username,
		url: body.url ? body.url : '',
	};

	tweetList.push(newList);
	console.log(tweetList);

	return res.status(201).send({ success: true, tweetList });
	// console.log(tweetList.concat(newList));
	// tweetList.concat(newList);
});

export default router;
