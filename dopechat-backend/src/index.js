const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');

dotenv.config();

const { PORT, CONNECTION_URL } = process.env;

const app = express();

app.use(cookieParser());

app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:8080'],
		credentials: true,
	})
);

app.use('/', router);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

mongoose
	.connect(CONNECTION_URL, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on http:localhost://${PORT}`);
		});
	})
	.catch(() => console.log('Error while starting'));
