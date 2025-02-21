const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = 'mongodb://127.0.0.1:27017'; // Using IP instead of localhost
const dbName = 'rumorApp';

app.use(cors());
app.use(express.json());

let db;
let mongoClient;

// Connect to MongoDB with retry logic
const connectToMongo = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      mongoClient = await MongoClient.connect(mongoUrl, {
        serverSelectionTimeoutMS: 5000,
        directConnection: true
      });
      console.log('Connected to MongoDB');
      db = mongoClient.db(dbName);
      
      // Create index on usernames field
      await db.collection('rumors').createIndex({ usernames: 1 });
      return true;
    } catch (err) {
      console.error(`Attempt ${i + 1}/${retries} - Error connecting to MongoDB:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Database not connected'
      });
    }
    
    // Test the database connection
    await db.command({ ping: 1 });
    
    res.json({ 
      status: 'ok',
      message: 'Server is healthy, database is connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection error'
    });
  }
});

// Middleware to check MongoDB connection
const checkDbConnection = (req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection not established' });
  }
  next();
};

// Graceful shutdown
const shutdown = async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
};

// Handle process termination
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Connect to MongoDB before starting the server
connectToMongo().then(success => {
  if (!success) {
    console.error('Failed to connect to MongoDB after multiple retries');
    process.exit(1);
  }
  
  // Only start the server after successful MongoDB connection
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// POST /api/rumors - Create a new rumor
app.post('/api/rumors', checkDbConnection, async (req, res) => {
  try {
    const { message, usernames } = req.body;
    
    if (!message || !usernames || !Array.isArray(usernames) || usernames.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request. Message and usernames array required.' 
      });
    }
    
    // Convert usernames to lowercase
    const normalizedUsernames = usernames.map(username => username.toLowerCase());
    
    const result = await db.collection('rumors').insertOne({
      message,
      usernames: normalizedUsernames,
      createdAt: new Date()
    });
    
    res.json({ success: true, rumorId: result.insertedId });
  } catch (error) {
    console.error('Error creating rumor:', error);
    res.status(500).json({ success: false, error: 'Failed to create rumor' });
  }
});

// GET /api/rumors/:username/about - Get rumors about a single user
app.get('/api/rumors/:username/about', checkDbConnection, async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    
    const rumors = await db.collection('rumors')
      .find({
        usernames: { $size: 1, $all: [username] }
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ rumors });
  } catch (error) {
    console.error('Error fetching rumors:', error);
    res.status(500).json({ error: 'Failed to fetch rumors' });
  }
});

// GET /api/rumors/:username/with-others - Get rumors involving user with others
app.get('/api/rumors/:username/with-others', checkDbConnection, async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    
    const rumors = await db.collection('rumors')
      .find({
        usernames: { 
          $all: [username],
          $exists: true,
          $not: { $size: 1 }
        }
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ rumors });
  } catch (error) {
    console.error('Error fetching rumors:', error);
    res.status(500).json({ error: 'Failed to fetch rumors' });
  }
});

// Check if username exists
app.get('/api/users/:username/exists', checkDbConnection, async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const count = await db.collection('rumors')
      .countDocuments({ usernames: username });
    
    res.json({ 
      exists: count > 0,
      message: count > 0 ? 'Username found' : 'Darling the User not exist'
    });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Failed to check username' });
  }
}); 