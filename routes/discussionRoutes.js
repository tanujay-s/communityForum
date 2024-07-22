const express = require('express');
const router = express.Router();
const { createDiscussion, getAllDiscussions, addComment, getComments } = require('../controllers/discussionControllers');

router.post('/', createDiscussion);


router.get('/', getAllDiscussions);


router.post('/comments', addComment);


router.get('/:id/comments', getComments);



module.exports = router;



