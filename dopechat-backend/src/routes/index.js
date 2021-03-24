const express = require('express');
const authRouter = require('./auth/router');
const userRouter = require('./user/router');
const chatRouter = require('./chat/router');
const eventRouter = require('./event/router');
const timestampRouter = require('./timestamp/router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/event', eventRouter);
router.use('/timestamp', timestampRouter);

module.exports = router;
