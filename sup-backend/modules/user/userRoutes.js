const express = require('express');
const router = express.Router();
const { getUserByEmail, getAllUsers } = require('./userController');

// list active peers / candidates
router.get('/', getAllUsers);

// search user by email
router.get('/search', getUserByEmail);

module.exports = router;
