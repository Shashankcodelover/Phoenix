const express = require('express');
const { reviewCode } = require('./codeReviewController');
const { validate, schemas } = require('../../middleware/inputValidator');

const router = express.Router();

router.post('/audit', validate(schemas.codeReview), reviewCode);

module.exports = router;
