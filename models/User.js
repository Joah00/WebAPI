const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create a model
const User = mongoose.model('User', userSchema);

module.exports = User;
