const Discussion = require('../models/discussion');


const createDiscussion = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate the required fields
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const discussion = await Discussion.create({ title, content });
        res.status(201).json({ discussion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find();
        res.json({ discussions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addComment = async (req, res) => {
    try {
     
        const author = req.session.user.email;
        const { discussionId, content } = req.body;

   
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        discussion.comments.push({ author, content });
        await discussion.save();

        res.status(201).json({ discussion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getComments = async (req, res) => {
    try {
        const discussionId = req.params.id;
        const discussion = await Discussion.findById(discussionId).select('comments');

        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        res.status(200).json({ comments: discussion.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDiscussion,
    getAllDiscussions,
    addComment,
    getComments
};




// module.exports = {
//     createDiscussion,
//     getAllDiscussions
// };
