const express = require('express');
const { reviewCode } = require('./codeReviewController');

const router = express.Router();

router.post('/audit', reviewCode);

module.exports = router;
