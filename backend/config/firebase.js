const admin = require('firebase-admin');

let db, auth;

try {
  // Try to load service account key
  const serviceAccount = require('../serviceAccountKey.json');
  
  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://coding-platform-default-rtdb.firebaseio.com'
  });

  // Get Firestore instance
  db = admin.firestore();
  
  // Get Auth instance
  auth = admin.auth();
  
  console.log('✅ Firebase initialized with service account');
} catch (error) {
  console.log('⚠️  Firebase service account not found, using in-memory data for development');
  console.log('📝 To use Firebase in production:');
  console.log('1. Create a Firebase project at https://console.firebase.google.com');
  console.log('2. Download serviceAccountKey.json and place it in the backend folder');
  console.log('3. Enable Firestore in your Firebase project');
  
  // Create mock Firebase instances for development
  db = {
    collection: (name) => ({
      doc: (id) => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async (data) => ({ id }),
        update: async (data) => ({ id }),
        delete: async () => ({ id })
      }),
      add: async (data) => ({ id: Date.now().toString() }),
      get: async () => ({ docs: [] }),
      where: () => ({
        get: async () => ({ docs: [] })
      }),
      limit: () => ({
        get: async () => ({ docs: [] })
      })
    })
  };
  
  auth = {
    verifyIdToken: async (token) => ({ uid: 'mock-user-id' }),
    createUser: async (data) => ({ uid: Date.now().toString() }),
    updateUser: async (uid, data) => ({ uid }),
    deleteUser: async (uid) => ({ uid })
  };
}

module.exports = { admin, db, auth }; 