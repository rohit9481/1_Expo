const express = require('express');
const { createChallenge, joinChallenge, getChallenges } = require('../controllers/ChallengeController');

const router = express.Router();

// Challenge Routes
router.post('/', createChallenge); // Create a new challenge
router.post('/join', joinChallenge); // Join a challenge
router.get('/', getChallenges); // Fetch all challenges

module.exports = router;