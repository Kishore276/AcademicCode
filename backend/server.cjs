const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config({ path: './config.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
const { db } = require('./config/firebase');

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  
  const userId = socket.handshake.query.userId;
  if (userId) {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Broadcast user online status
    socket.broadcast.emit('userOnline', { userId, socketId: socket.id });
    
    console.log(`👤 User ${userId} is now online`);
  }

  // Handle real-time code collaboration
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🚪 User ${socket.userId} joined room ${roomId}`);
    socket.to(roomId).emit('userJoined', { userId: socket.userId, roomId });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 User ${socket.userId} left room ${roomId}`);
    socket.to(roomId).emit('userLeft', { userId: socket.userId, roomId });
  });

  socket.on('codeChange', (data) => {
    socket.to(data.roomId).emit('codeUpdate', {
      code: data.code,
      language: data.language,
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('chatMessage', (data) => {
    const message = {
      id: Date.now().toString(),
      senderId: socket.userId,
      message: data.message,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    io.to(data.roomId).emit('newMessage', message);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('userTyping', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      socket.broadcast.emit('userOffline', { userId: socket.userId });
      console.log(`👤 User ${socket.userId} is now offline`);
    }
  });
});

// Test Firebase connection
const testFirebaseConnection = async () => {
  try {
    // Test the connection by trying to read from a collection
    await db.collection('test').limit(1).get();
    console.log('✅ Connected to Firebase Firestore');
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('1. Create a Firebase project at https://console.firebase.google.com');
    console.log('2. Download serviceAccountKey.json and place it in the backend folder');
    console.log('3. Enable Firestore in your Firebase project');
    
    // Continue running the server even if Firebase fails
    console.log('\n⚠️  Server will continue without database connection');
  }
};

testFirebaseConnection();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Import services
const pdfExtractor = require('./services/pdfExtractor');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/contests', require('./routes/contests'));
app.use('/api/submissions', require('./routes/submissions'));

// PDF Upload and Question Extraction Route
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No PDF file uploaded' 
      });
    }

    // Check if user is authenticated and has teacher/admin role
    // For now, we'll skip authentication check, but you should add it
    const userRole = req.body.userRole || 'teacher';
    if (!['teacher', 'admin'].includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only teachers and admins can upload questions' 
      });
    }

    // Extract questions from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const extractionResult = await pdfExtractor.extractQuestions(pdfBuffer, req.file.originalname);

    if (!extractionResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to extract questions from PDF',
        error: extractionResult.error
      });
    }

    // Save extracted questions to database
    const savedQuestions = [];
    const problemService = require('./services/problemService');
    
    for (const questionData of extractionResult.questions) {
      try {
        const question = await problemService.createProblem({
          ...questionData,
          createdBy: req.body.userId || 'default-admin-id'
        });
        
        savedQuestions.push(question);
      } catch (error) {
        console.error('Error saving question:', error);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Successfully extracted ${savedQuestions.length} questions from PDF`,
      questions: savedQuestions,
      totalExtracted: extractionResult.totalQuestions,
      totalSaved: savedQuestions.length
    });

  } catch (error) {
    console.error('PDF upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error processing PDF file',
      error: error.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Coding Platform API is running',
    database: 'Firebase Firestore',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: Firebase Firestore`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 Socket.IO server ready on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
}); 