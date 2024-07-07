const express = require('express');
const router = express.Router();

const adminMiddleware = require('../middleware/admin');
const Announcement = require('../models/announcements');


//Create an announcement (admin only)
router.post('/', adminMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newAnnouncement = new Announcement({
            title,
            content,
            createdBy: req.session.userId
        });

        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all announcements (public)
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find().populate('createdBy', 'email');
        res.status(200).json({ announcements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an announcement (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const announcementId = req.params.id;
        await Announcement.deleteOne({ _id: announcementId });
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
