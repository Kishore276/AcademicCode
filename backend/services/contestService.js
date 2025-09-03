const { db } = require('../config/firebase');

class ContestService {
  constructor() {
    this.contestsCollection = db.collection('contests');
  }

  // Create new contest
  async createContest(contestData) {
    try {
      const contestDoc = {
        ...contestData,
        participants: [],
        isActive: true,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await this.contestsCollection.add(contestDoc);
      return {
        id: docRef.id,
        ...contestDoc
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all contests with filters
  async getAllContests(filters = {}) {
    try {
      let query = this.contestsCollection.where('isActive', '==', true);

      if (filters.status) {
        const now = new Date();
        if (filters.status === 'upcoming') {
          query = query.where('startTime', '>', now);
        } else if (filters.status === 'ongoing') {
          // Note: Firestore doesn't support complex queries like this
          // We'll filter in memory for now
        } else if (filters.status === 'past') {
          query = query.where('endTime', '<', now);
        }
      }

      const snapshot = await query.get();
      let contests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply status filter for ongoing contests
      if (filters.status === 'ongoing') {
        const now = new Date();
        contests = contests.filter(contest => {
          const startTime = contest.startTime.toDate ? contest.startTime.toDate() : new Date(contest.startTime);
          const endTime = contest.endTime.toDate ? contest.endTime.toDate() : new Date(contest.endTime);
          return startTime <= now && endTime > now;
        });
      }

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        contests = contests.filter(contest => 
          contest.title.toLowerCase().includes(searchTerm) ||
          contest.description.toLowerCase().includes(searchTerm)
        );
      }

      return contests;
    } catch (error) {
      throw error;
    }
  }

  // Get contest by ID
  async getContestById(id) {
    try {
      const doc = await this.contestsCollection.doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw error;
    }
  }

  // Update contest
  async updateContest(id, updates) {
    try {
      const contestRef = this.contestsCollection.doc(id);
      await contestRef.update({
        ...updates,
        updatedAt: new Date()
      });
      
      return await this.getContestById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete contest
  async deleteContest(id) {
    try {
      await this.contestsCollection.doc(id).delete();
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Join contest
  async joinContest(contestId, userId) {
    try {
      const contestRef = this.contestsCollection.doc(contestId);
      const contest = await this.getContestById(contestId);
      
      if (!contest) {
        throw new Error('Contest not found');
      }

      // Check if user is already a participant
      const existingParticipant = contest.participants.find(p => p.user === userId);
      if (existingParticipant) {
        throw new Error('User already joined this contest');
      }

      // Add user to participants
      const newParticipant = {
        user: userId,
        score: 0,
        solvedProblems: [],
        joinedAt: new Date()
      };

      await contestRef.update({
        participants: [...contest.participants, newParticipant]
      });

      return { message: 'Successfully joined contest' };
    } catch (error) {
      throw error;
    }
  }

  // Submit solution for contest problem
  async submitContestSolution(contestId, submissionData) {
    try {
      const contest = await this.getContestById(contestId);
      if (!contest) {
        throw new Error('Contest not found');
      }

      // Find participant
      const participantIndex = contest.participants.findIndex(p => p.user === submissionData.userId);
      if (participantIndex === -1) {
        throw new Error('User not registered for this contest');
      }

      // Check if problem is part of the contest
      if (!contest.problems.includes(submissionData.problemId)) {
        throw new Error('Problem not part of this contest');
      }

      // For now, we'll just update the score (in a real app, you'd run the code)
      const score = Math.floor(Math.random() * 100) + 1; // Mock score
      
      // Update participant's solved problems
      const participant = contest.participants[participantIndex];
      const existingSolutionIndex = participant.solvedProblems.findIndex(
        s => s.problem === submissionData.problemId
      );

      if (existingSolutionIndex !== -1) {
        participant.solvedProblems[existingSolutionIndex].score = Math.max(
          participant.solvedProblems[existingSolutionIndex].score, 
          score
        );
      } else {
        participant.solvedProblems.push({
          problem: submissionData.problemId,
          solvedAt: new Date(),
          score: score
        });
      }

      // Recalculate total score
      participant.score = participant.solvedProblems.reduce((total, s) => total + s.score, 0);

      // Update contest
      await this.updateContest(contestId, {
        participants: contest.participants
      });

      return { message: 'Solution submitted successfully', participant };
    } catch (error) {
      throw error;
    }
  }

  // Get contest leaderboard
  async getContestLeaderboard(contestId) {
    try {
      const contest = await this.getContestById(contestId);
      if (!contest) {
        throw new Error('Contest not found');
      }

      // Sort participants by score (descending)
      const leaderboard = contest.participants.sort((a, b) => b.score - a.score);
      
      return leaderboard;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContestService(); 