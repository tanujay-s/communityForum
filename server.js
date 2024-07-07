const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const Discussion = require('./models/discussion');
const discussionRoutes = require('./routes/discussionRoutes');
const adminMiddleware = require('./middleware/admin');
const announcementRoutes = require('./routes/announcementRoutes');
//const pollRoutes = require('./routes/pollRoutes');
const Poll = require('./models/poll');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://tanujaysingh063:G4I9uxZOL5RrpRQy@communitycluster0.lqcmkhs.mongodb.net/?retryWrites=true&w=majority&appName=communitycluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Express middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));



// Admin login route
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isAdmin || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  req.session.isAdmin = true;
  req.session.userId = user._id;

  res.json({ message: 'Login successful' });
});

//admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.json({ message: 'Logout successful' });
  });
});



// Delete discussion route

app.delete('/api/discussions/:id', adminMiddleware, async (req, res) => {
  try {
    const discussionId = req.params.id;
    console.log('Deleting discussion with ID:', discussionId);

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      console.log(`Discussion with ID ${discussionId} not found`);
      return res.status(404).json({ message: 'Discussion not found' });
    }

    await Discussion.deleteOne({ _id: discussionId });
    console.log(`Discussion with ID ${discussionId} deleted successfully`);
    res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: error.message });
  }
});




// Routes
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User(
      {
        email: req.body.email,
        password: hashedPassword
      });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Compare the hashed password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).send('Invalid email or password');
    }

    req.session.user = user;

    res.status(200).send('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


// Route to check if the user is logged in
app.get('/isLoggedIn', (req, res) => {
  // Check if the user is logged in
  const isLoggedIn = req.session && req.session.user;

  // Send JSON response indicating whether the user is logged in
  res.json({ isLoggedIn });
});


// Route for logout
app.post('/logout', (req, res) => {
  // Check if the user is logged in
  if (req.session && req.session.user) {
    // Destroy the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Internal server error');
      } else {
        // Redirect the user to the login page after logout
        res.status(200).send('Logout successful');
      }
    });
  } else {
    // If the user is not logged in, send a 401 Unauthorized status
    res.status(401).send('You are not logged in');
  }
});



app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Route for rendering the index.html file
app.get('/dashboard', (req, res) => {
  // Check if the user is logged in
  const isLoggedIn = req.session && req.session.user;

  // Render the index.html file and pass the isLoggedIn status to the client
  if (isLoggedIn) {
    console.log('true');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // If user is not logged in, redirect to the login page
    res.redirect('/login');
  }
});

// Routes
app.use('/api/discussions', discussionRoutes);

// Announcement Routes
app.use('/api/announcements', announcementRoutes);

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/announcements', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'announcements.html'));
});

//Polls routes
// app.use('/api/polls',pollRoutes);

// Create Poll (Admin Only)
app.post('/api/polls', adminMiddleware, async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;
    const newPoll = new Poll({
      question,
      options: options.map(option => ({ text: option })),
      createdBy: req.session.userId,
      expiresAt
    });

    await newPoll.save();
    res.status(201).json({ message: 'Poll created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get All Polls
app.get('/api/polls', async (req, res) => {
  try {

    const polls = await Poll.find();
    res.status(200).json({ polls });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get Poll by ID
app.get('/api/polls/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      console.log('Poll not found');
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.status(200).json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ message: error.message });
  }
});

// Vote in Poll
app.post('/api/polls/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    const userId = req.session.userId; // Assuming user ID is stored in session

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user has already voted
    if (poll.votedUsers.includes(userId)) {
      return res.status(403).json({ message: 'You have already voted in this poll' });
    }

    poll.options[optionIndex].votes += 1;
    poll.votedUsers.push(userId);
    await poll.save();

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Poll Results
app.get('/api/polls/:id/results', async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json({ results: poll.options });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Poll (Admin Only)
app.delete('/api/polls/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findByIdAndDelete(id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});