const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema]  // Embed comments in discussions
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;



// const mongoose = require('mongoose');

// const discussionSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User' // Reference to the User model for the user who created the discussion
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Discussion = mongoose.model('Discussion', discussionSchema);

// module.exports = Discussion;
