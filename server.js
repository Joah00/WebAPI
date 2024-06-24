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

// Serve register.html page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
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

// Serve register.html page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Create a new user in the database
        const newUser = new User({
            username,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(200).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user. Please try again later.' });
    }
});


// Endpoint to fetch user history based on userId
app.get('/api/history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Validate userId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const userHistory = await UserHistory.find({ userId: new ObjectId(userId) }).sort({ clickedAt: -1 });
        res.json(userHistory);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Failed to fetch history. Please try again later.' });
    }
});

// Endpoint to delete a history entry
app.delete('/api/history/:historyId', async (req, res) => {
    const { historyId } = req.params;

    try {
        // Validate historyId
        if (!ObjectId.isValid(historyId)) {
            return res.status(400).json({ message: 'Invalid history ID.' });
        }

        // Delete the history entry from the database
        await UserHistory.deleteOne({ _id: new ObjectId(historyId) });

        res.status(200).json({ message: 'History entry deleted successfully.' });
    } catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ message: 'Failed to delete history entry. Please try again later.' });
    }
});

// Endpoint to fetch a specific recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
    const recipeId = req.params.id;
    const options = {
        method: 'GET',
        url: `https://chinese-food-db.p.rapidapi.com/${recipeId}`,
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
        res.status(500).json({ message: 'Failed to fetch recipe details' });
    }
});

// Endpoint to save user history
app.post('/api/saveHistory', async (req, res) => {
    const { userId, recipeId, title, difficulty, image } = req.body;

    try {
        // Validate userId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const historyEntry = new UserHistory({
            userId: new ObjectId(userId), // Correctly use 'new' with ObjectId
            recipeId,
            title,
            difficulty,
            image
        });

        await historyEntry.save();
        res.status(201).json({ message: 'History saved successfully.' });
    } catch (error) {
        console.error('Error saving history:', error);
        res.status(500).json({ message: 'Failed to save history. Please try again later.' });
    }
});

// Endpoint to return the recipe detail page
app.get('/recipeDetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recipeDetail.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
