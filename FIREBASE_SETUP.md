# Firebase Setup Guide

This guide will help you set up Firebase for the coding platform.

## 🔥 **Step 1: Create Firebase Project**

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Click "Create a project" or "Add project"

2. **Project Setup**
   - Enter a project name (e.g., "coding-platform")
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

3. **Project Configuration**
   - Wait for the project to be created
   - Click "Continue" when ready

## 🔥 **Step 2: Enable Firestore Database**

1. **Navigate to Firestore**
   - In the Firebase console, click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Security Rules**
   - Choose "Start in test mode" (for development)
   - Click "Next"

3. **Location**
   - Choose a location close to your users
   - Click "Done"

## 🔥 **Step 3: Generate Service Account Key**

1. **Go to Project Settings**
   - Click the gear icon next to "Project Overview"
   - Select "Project settings"

2. **Service Accounts Tab**
   - Click the "Service accounts" tab
   - Click "Generate new private key"

3. **Download Key**
   - Click "Generate key"
   - Save the JSON file as `serviceAccountKey.json`
   - Place it in the `backend` folder

## 🔥 **Step 4: Update Configuration**

1. **Place Service Account Key**
   ```
   backend/
   ├── serviceAccountKey.json  ← Place your downloaded file here
   ├── server.cjs
   ├── config.env
   └── ...
   ```

2. **Verify File Structure**
   ```bash
   # Your backend folder should look like this:
   ls backend/
   # serviceAccountKey.json  server.cjs  config.env  package.json  ...
   ```

## 🔥 **Step 5: Install Dependencies**

```bash
cd backend
npm install
```

## 🔥 **Step 6: Test Connection**

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📊 Database: Firebase Firestore
✅ Connected to Firebase Firestore
```

## 🔥 **Step 7: Seed Database (Optional)**

Create a seed script for Firebase:

```javascript
// backend/seedFirebase.js
const { db } = require('./config/firebase');
const userService = require('./services/userService');
const problemService = require('./services/problemService');
const contestService = require('./services/contestService');

async function seedFirebase() {
  try {
    console.log('🌱 Seeding Firebase database...');

    // Create sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@codingplatform.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        username: 'teacher1',
        email: 'teacher1@codingplatform.com',
        password: 'teacher123',
        name: 'John Smith',
        role: 'teacher'
      },
      {
        username: 'student1',
        email: 'student1@codingplatform.com',
        password: 'student123',
        name: 'Alice Johnson',
        role: 'student'
      }
    ];

    for (const userData of users) {
      await userService.createUser(userData);
      console.log(`✅ Created user: ${userData.username}`);
    }

    // Create sample problems
    const problems = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers...',
        difficulty: 'easy',
        category: 'Arrays',
        tags: ['array', 'hash-table']
      },
      {
        title: 'Valid Parentheses',
        description: 'Given a string containing...',
        difficulty: 'easy',
        category: 'Strings',
        tags: ['string', 'stack']
      }
    ];

    for (const problemData of problems) {
      await problemService.createProblem(problemData);
      console.log(`✅ Created problem: ${problemData.title}`);
    }

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedFirebase();
```

Run the seed script:
```bash
cd backend
node seedFirebase.js
```

## 🔥 **Step 8: Security Rules (Production)**

For production, update Firestore security rules:

```javascript
// In Firebase Console > Firestore Database > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or more specific rules:
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /problems/{problemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
  }
}
```

## 🔥 **Troubleshooting**

### **Common Issues:**

1. **"Service account key not found"**
   - Make sure `serviceAccountKey.json` is in the `backend` folder
   - Check file permissions

2. **"Firebase connection error"**
   - Verify your service account key is correct
   - Check if Firestore is enabled in your Firebase project
   - Ensure your project has billing enabled (if required)

3. **"Permission denied"**
   - Check Firestore security rules
   - Verify your service account has the correct permissions

### **Testing Connection:**

```bash
# Test the API
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Coding Platform API is running",
  "database": "Firebase Firestore",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔥 **Next Steps**

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Test the application:**
   - Visit `http://localhost:5173`
   - Login with test credentials
   - Try uploading a PDF file

## 🔥 **Firebase Features Used**

- **Firestore**: NoSQL database for storing users, problems, contests, and submissions
- **Authentication**: User management and JWT tokens
- **Storage**: File uploads (can be added for PDF storage)
- **Real-time**: Live updates (can be implemented with Firestore listeners)

## 🔥 **Cost Considerations**

- **Firebase Free Tier**: 50,000 reads/day, 20,000 writes/day
- **Firestore**: $0.18 per 100,000 reads, $0.18 per 100,000 writes
- **Storage**: $0.026 per GB/month
- **Authentication**: Free for unlimited users

For most development and small projects, the free tier is sufficient! 