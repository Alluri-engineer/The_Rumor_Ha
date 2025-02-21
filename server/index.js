const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Azure Cosmos DB connection configuration
const config = {
  connectionString: process.env.MONGODB_URI || "mongodb://the-rumor-account:IJcZvHh7Aq0wdQI9djTDNNxH7Ur2Et2vCVwQPXD98CdaoJmOx4Q5e0Sk4wwWaBreTchYBu6YLz4XACDbtLa7KQ==@the-rumor-account.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@the-rumor-account@",
  dbName: "rumorApp"
};

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'],
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

let db;
let mongoClient;

// Enhanced MongoDB connection with retry logic
const connectToMongo = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      mongoClient = await MongoClient.connect(config.connectionString, {
        ssl: true,
        tlsAllowInvalidCertificates: false,
        retryWrites: false,
        maxIdleTimeMS: 120000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      });
      
      console.log('Successfully connected to Azure Cosmos DB');
      db = mongoClient.db(config.dbName);
      
      // Ensure indexes
      await Promise.all([
        db.collection('rumors').createIndex({ usernames: 1 }),
        db.collection('rumors').createIndex({ createdAt: -1 })
      ]);
      
      return true;
    } catch (err) {
      console.error(`Connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
};

// Graceful shutdown handler
const gracefulShutdown = async () => {
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log('MongoDB connection closed gracefully');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  }
  process.exit(0);
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Middleware to check DB connection
const checkDbConnection = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ 
      error: 'Database connection not established',
      message: 'Service temporarily unavailable'
    });
  }
  next();
};

// Connect to MongoDB before starting the server
connectToMongo().then(success => {
  if (!success) {
    console.error('Failed to connect to MongoDB after multiple retries');
    process.exit(1);
  }
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ 
        status: 'error',
        message: 'Database not connected'
      });
    }
    
    // Test the database connection
    await db.command({ ping: 1 });
    
    res.json({ 
      status: 'healthy',
      message: 'Server is running and database is connected',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'error',
      message: 'Database connection error'
    });
  }
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