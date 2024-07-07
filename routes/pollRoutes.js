const express = require('express');
const router = express.Router();

const Poll = require('../models/poll');
const adminMiddleware = require('../middleware/admin');

// Create Poll (Admin Only)
// router.post('/', adminMiddleware, async (req, res) => {
//     try {
//         const { question, options, expiresAt } = req.body;
//         const newPoll = new Poll({
//             question,
//             options: options.map(option => ({ text: option })),
//             createdBy: req.session.userId,
//             expiresAt
//         });

//         await newPoll.save();
//         res.status(201).json({ message: 'Poll created successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

//Get All Polls
// router.get('/', async (req, res) => {
//     try {
        
//         const polls = await Poll.find();
//         res.status(200).json({ polls });
//     } catch (error) {
//         console.error('Error fetching polls:', error);
//         res.status(500).json({ message: error.message });
//     }
// });



// Get Poll by ID
// router.get('/api/polls/:id', async (req, res) => {
//     console.log('Fetching poll with ID in routes:', req.params.id);
//     try {
//         const pollId = req.params.id;
//         console.log('Fetching poll with ID in routes :', pollId); 
//         const poll = await Poll.findById(pollId);
//         if (!poll) {
//             console.log('Poll not found');
//             return res.status(404).json({ message: 'Poll not found' });
//         }
//         console.log('Poll found:', poll);
//         res.status(200).json(poll);
//     } catch (error) {
//         console.error('Error fetching poll:', error);
//         res.status(500).json({ message: error.message });
//     }
// });



// // Vote in Poll
// router.post('/:id/vote', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { optionIndex } = req.body;

//         const poll = await Poll.findById(id);
//         if (!poll) {
//             return res.status(404).json({ message: 'Poll not found' });
//         }

//         poll.options[optionIndex].votes += 1;
//         await poll.save();

//         res.status(200).json({ message: 'Vote recorded successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get Poll Results
// router.get('/:id/results', async (req, res) => {
//     try {
//         const { id } = req.params;

//         const poll = await Poll.findById(id);
//         if (!poll) {
//             return res.status(404).json({ message: 'Poll not found' });
//         }

//         res.status(200).json({ results: poll.options });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;
