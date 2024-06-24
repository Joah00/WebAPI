const express = require('express');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const UserHistory = require('./models/UserHistory');
const { ObjectId } = mongoose.Types;

const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://joah:joah123@joahdb.7woevae.mongodb.net/JoahDB?retryWrites=true&w=majority";

// Connect to MongoDB Atlas
async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 50000, // Increase the timeout to 50 seconds
        });
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas', error);
    }
}
connectToMongoDB();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes

// Serve login.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // If the username and password match, return success and the user ID
        res.status(200).json({ message: 'Login successful.', userId: user._id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to log in. Please try again later.' });
    }
});

// Endpoint to return all recipes
app.get('/api/recipes', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://chinese-food-db.p.rapidapi.com/',
        headers: {
            'x-rapidapi-key': 'cf9e87eb01msha39c88fb9fc5eefp11c45bjsn474218691ddf',
            'x-rapidapi-host': 'chinese-food-db.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
