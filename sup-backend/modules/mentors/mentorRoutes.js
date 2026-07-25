const express = require('express');
const {
  chatWithMentor,
  mentorDebate,
  getMentorProfiles
} = require('./mentorController');

const router = express.Router();

// GET /api/v1/mentors/profiles — Get all mentor profiles
router.get('/profiles', getMentorProfiles);

// POST /api/v1/mentors/chat — Chat with a specific mentor
router.post('/chat', chatWithMentor);

// POST /api/v1/mentors/debate — Get all mentors' opinions on a topic
router.post('/debate', mentorDebate);

module.exports = router;
