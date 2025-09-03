const { db, auth } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.usersCollection = db.collection('users');
  }

  // Create new user
  async createUser(userData) {
    try {
      const { username, email, password, name, role = 'student' } = userData;

      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user document
      const userDoc = {
        username,
        email,
        password: hashedPassword,
        name,
        role,
        profile: {
          avatar: '',
          bio: '',
          skills: [],
          experience: ''
        },
        stats: {
          problemsSolved: 0,
          contestsWon: 0,
          totalScore: 0
        },
        createdAt: new Date(),
        lastActive: new Date()
      };

      const docRef = await this.usersCollection.add(userDoc);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = userDoc;
      return {
        id: docRef.id,
        ...userWithoutPassword
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const snapshot = await this.usersCollection.where('email', '==', email).limit(1).get();
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const doc = await this.usersCollection.doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      const snapshot = await this.usersCollection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        password: undefined // Remove password from response
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(id, updates) {
    try {
      const userRef = this.usersCollection.doc(id);
      await userRef.update({
        ...updates,
        updatedAt: new Date()
      });
      
      return await this.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      await this.usersCollection.doc(id).delete();
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }
}

module.exports = new UserService(); 