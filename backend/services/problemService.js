const { db } = require('../config/firebase');

class ProblemService {
  constructor() {
    this.problemsCollection = db.collection('problems');
  }

  // Create new problem
  async createProblem(problemData) {
    try {
      const problemDoc = {
        ...problemData,
        stats: {
          submissions: 0,
          accepted: 0,
          acceptanceRate: 0
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await this.problemsCollection.add(problemDoc);
      return {
        id: docRef.id,
        ...problemDoc
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all problems with filters
  async getAllProblems(filters = {}) {
    try {
      let query = this.problemsCollection.where('isActive', '==', true);

      if (filters.difficulty) {
        query = query.where('difficulty', '==', filters.difficulty);
      }

      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }

      const snapshot = await query.get();
      let problems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply search filter if provided
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        problems = problems.filter(problem => 
          problem.title.toLowerCase().includes(searchTerm) ||
          problem.description.toLowerCase().includes(searchTerm)
        );
      }

      return problems;
    } catch (error) {
      throw error;
    }
  }

  // Get problem by ID
  async getProblemById(id) {
    try {
      const doc = await this.problemsCollection.doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw error;
    }
  }

  // Update problem
  async updateProblem(id, updates) {
    try {
      const problemRef = this.problemsCollection.doc(id);
      await problemRef.update({
        ...updates,
        updatedAt: new Date()
      });
      
      return await this.getProblemById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete problem
  async deleteProblem(id) {
    try {
      await this.problemsCollection.doc(id).delete();
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get problems by category
  async getProblemsByCategory(category) {
    try {
      const snapshot = await this.problemsCollection
        .where('category', '==', category)
        .where('isActive', '==', true)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get problems by difficulty
  async getProblemsByDifficulty(difficulty) {
    try {
      const snapshot = await this.problemsCollection
        .where('difficulty', '==', difficulty)
        .where('isActive', '==', true)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update problem stats
  async updateProblemStats(id, stats) {
    try {
      const problemRef = this.problemsCollection.doc(id);
      const updates = { ...stats };
      
      if (stats.submissions !== undefined && stats.accepted !== undefined) {
        updates.acceptanceRate = (stats.accepted / stats.submissions) * 100;
      }
      
      await problemRef.update({
        stats: updates,
        updatedAt: new Date()
      });
      
      return await this.getProblemById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProblemService(); 