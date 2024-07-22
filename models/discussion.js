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


