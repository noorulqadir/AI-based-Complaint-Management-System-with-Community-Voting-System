const upload = require("../middleware/uploadMiddleware");
const { classifyComplaint } = require("../services/aiServices");
const Notification = require("../models/Notification");
const express = require("express");
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/authMiddleware");
const Vote = require("../models/Vote");

const router = express.Router();


// Submit Complaint
router.post("/", protect, upload.single("image"), async (req, res) => {

    try {

        const { title, description } = req.body;

        if (!title || !description)  {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const predictedCategory = classifyComplaint(description);
        const complaint = await Complaint.create({
            title,
            description,
            category: predictedCategory,
            image: req.file ? req.file.filename : null,
            user: req.user._id,
            statusHistory: [
                {
                    status: "Pending",
                    updatedBy: req.user._id
                }
            ]
        });

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }

});

// Get My Complaints
router.get("/my", protect, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "My complaints fetched successfully",
            complaints
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// Get Single Complaint
router.get("/:id", protect, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        if (complaint.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not allowed to view this complaint"
            });
        }

        res.status(200).json({
            message: "Complaint fetched successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// Vote / Unvote Complaint
router.post("/:id/vote", protect, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const existingVote = await Vote.findOne({
            user: req.user._id,
            complaint: complaint._id
        });

        if (existingVote) {
            await existingVote.deleteOne();

            complaint.votes = Math.max(complaint.votes - 1, 0);
            await complaint.save();

            return res.status(200).json({
                message: "Vote removed successfully",
                votes: complaint.votes
            });
        }

        await Vote.create({
            user: req.user._id,
            complaint: complaint._id
        });

        complaint.votes += 1;
        await complaint.save();

        res.status(200).json({
            message: "Vote added successfully",
            votes: complaint.votes
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// Get All Complaints with Search & Filter
router.get("/", protect, async (req, res) => {
    try {
        const { category, status, keyword } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        const complaints = await Complaint.find(filter)
            .populate("user", "name email")
            .sort({ votes: -1, createdAt: -1 });

        res.status(200).json({
            message: "Complaints fetched successfully",
            complaints
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// Update Complaint Status
router.put("/:id/status", protect, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "In Progress", "Resolved"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        if (req.user.role !== "staff" && req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only staff or admin can update status"
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        complaint.status = status;

        complaint.statusHistory.push({
            status: status,
            updatedBy: req.user._id
        });

        await complaint.save();
        await Notification.create({
            user: complaint.user,
            message: `Your complaint "${complaint.title}" status has been updated to ${status}`
        });

        res.status(200).json({
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

module.exports = router;