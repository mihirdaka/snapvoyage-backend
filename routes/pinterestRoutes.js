const express = require('express');
const router = express.Router();
const pinterestController = require('../controllers/photoController.js');

router.get('/auth', pinterestController.getPinterestAuth);
router.get('/auth/callback', pinterestController.pinterestCallback);
// router.get('/boards', pinterestController.getUserBoards);
router.get('/fetchAllPins', pinterestController.fetchUserBoardsAndPins);
// router.get('/pins', pinterestController.getBoardPins);

module.exports = router;
