const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    },

    votes: {
        type: Number,
        default: 0
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    statusHistory: [
    {
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved"]
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
]

}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);