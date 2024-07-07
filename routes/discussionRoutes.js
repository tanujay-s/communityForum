const express = require('express');
const router = express.Router();
const { createDiscussion, getAllDiscussions, addComment, getComments } = require('../controllers/discussionControllers');
// Route to create a new discussion
router.post('/', createDiscussion);

// Route to get all discussions
router.get('/', getAllDiscussions);

// Route to add a comment to a discussion
router.post('/comments', addComment);

// Route to get comments for a discussion
router.get('/:id/comments', getComments);



module.exports = router;





// const express = require('express');
// const router = express.Router();
// const {createDiscussion,getAllDiscussions} = require('../controllers/discussionControllers');

// // Route to create a new discussion
// console.log('fetch req comes to create discussion');
// router.post('/', createDiscussion);

// // Route to get all discussions
// router.get('/', getAllDiscussions);
//module.exports = router;



/////////////////////////////////////////////////////////////////////////////////////////////////////////

// router.get('/discussions', (req, res) => {
//     // Implement logic to fetch discussions from the database and send response
//     res.send('GET request to /api/discussions');
//   });

//   router.use((req, res, next) => {
//     console.log('Request to /api/discussions');
//     next(); // Call next to continue to the next middleware or route handler
//   });

// Route to get a single discussion by ID
// router.get('/discussions/:id',getDiscussionById);

// // Route to update a discussion by ID
// router.put('/discussions/:id',updateDiscussionById);

// // Route to delete a discussion by ID
// router.delete('/discussions/:id',deleteDiscussionById);


