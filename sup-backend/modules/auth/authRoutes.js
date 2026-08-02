const express = require('express');
const { signup, login } = require('./authController');
const { validate, schemas } = require('../../middleware/inputValidator');

const router = express.Router();

router.post('/signup', validate(schemas.signup), signup);
router.post('/login', validate(schemas.login), login);

module.exports = router;