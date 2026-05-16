const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get my notifications
router.get("/", protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// Mark notification as read
router.put("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not allowed"
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

module.exports = router;