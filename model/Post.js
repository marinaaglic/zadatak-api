const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String
    },
    allowed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Post", postSchema);