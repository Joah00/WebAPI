const mongoose = require('mongoose');

const UserHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    clickedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserHistory', UserHistorySchema);
