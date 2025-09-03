const { db } = require('../config/firebase');

class SubmissionService {
  constructor() {
    this.submissionsCollection = db.collection('submissions');
  }

  // Create new submission
  async createSubmission(submissionData) {
    try {
      const submissionDoc = {
        ...submissionData,
        status: 'pending',
        executionTime: 0,
        memoryUsed: 0,
        score: 0,
        testCases: [],
        submittedAt: new Date()
      };

      const docRef = await this.submissionsCollection.add(submissionDoc);
      return {
        id: docRef.id,
        ...submissionDoc
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all submissions with filters
  async getAllSubmissions(filters = {}) {
    try {
      let query = this.submissionsCollection;

      if (filters.user) {
        query = query.where('user', '==', filters.user);
      }

      if (filters.problem) {
        query = query.where('problem', '==', filters.problem);
      }

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.language) {
        query = query.where('language', '==', filters.language);
      }

      const snapshot = await query.orderBy('submittedAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get submission by ID
  async getSubmissionById(id) {
    try {
      const doc = await this.submissionsCollection.doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user submissions
  async getUserSubmissions(userId) {
    try {
      const snapshot = await this.submissionsCollection
        .where('user', '==', userId)
        .orderBy('submittedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get problem submissions
  async getProblemSubmissions(problemId) {
    try {
      const snapshot = await this.submissionsCollection
        .where('problem', '==', problemId)
        .orderBy('submittedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update submission
  async updateSubmission(id, updates) {
    try {
      const submissionRef = this.submissionsCollection.doc(id);
      await submissionRef.update({
        ...updates,
        updatedAt: new Date()
      });
      
      return await this.getSubmissionById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get submission statistics
  async getSubmissionStats() {
    try {
      const snapshot = await this.submissionsCollection.get();
      const submissions = snapshot.docs.map(doc => doc.data());

      const totalSubmissions = submissions.length;
      const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
      const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
      const runningSubmissions = submissions.filter(s => s.status === 'running').length;

      // Language stats
      const languageStats = {};
      submissions.forEach(submission => {
        const lang = submission.language;
        if (!languageStats[lang]) {
          languageStats[lang] = { count: 0, accepted: 0 };
        }
        languageStats[lang].count++;
        if (submission.status === 'accepted') {
          languageStats[lang].accepted++;
        }
      });

      // Status stats
      const statusStats = {};
      submissions.forEach(submission => {
        const status = submission.status;
        statusStats[status] = (statusStats[status] || 0) + 1;
      });

      return {
        total: totalSubmissions,
        accepted: acceptedSubmissions,
        pending: pendingSubmissions,
        running: runningSubmissions,
        acceptanceRate: totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0,
        languageStats: Object.entries(languageStats).map(([lang, stats]) => ({
          _id: lang,
          count: stats.count,
          accepted: stats.accepted
        })),
        statusStats: Object.entries(statusStats).map(([status, count]) => ({
          _id: status,
          count
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete submission
  async deleteSubmission(id) {
    try {
      const submissionRef = this.submissionsCollection.doc(id);
      await submissionRef.delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Rejudge submission
  async rejudgeSubmission(id) {
    try {
      const submission = await this.getSubmissionById(id);
      if (!submission) {
        throw new Error('Submission not found');
      }

      // Reset submission status
      await this.updateSubmission(id, {
        status: 'pending',
        executionTime: 0,
        memoryUsed: 0,
        score: 0,
        testCases: []
      });

      // Simulate rejudgment
      setTimeout(async () => {
        try {
          const isAccepted = Math.random() > 0.3;
          const executionTime = Math.floor(Math.random() * 1000) + 100;
          const memoryUsed = Math.floor(Math.random() * 50) + 10;

          await this.updateSubmission(id, {
            status: isAccepted ? 'accepted' : 'wrong_answer',
            executionTime: executionTime,
            memoryUsed: memoryUsed,
            score: isAccepted ? 100 : 0,
            testCases: [
              {
                input: 'test input',
                expectedOutput: 'expected output',
                actualOutput: isAccepted ? 'expected output' : 'wrong output',
                passed: isAccepted,
                executionTime: executionTime,
                memoryUsed: memoryUsed
              }
            ]
          });
        } catch (error) {
          console.error('Error rejudging submission:', error);
          await this.updateSubmission(id, { status: 'runtime_error' });
        }
      }, 2000);

      return { message: 'Submission rejudgment started' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SubmissionService(); 