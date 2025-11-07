

import mongoose from "mongoose";
import { ref } from "process";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: "TODO",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    priority: {
        type: String,
    },
    deadline: {
        type: String,
    },
    helpfulNotes: {
        type: String,
    },
    relatedSkills: {
        type: [String],
    }
},{timestamps: true});

export default mongoose.model("Ticket", ticketSchema);