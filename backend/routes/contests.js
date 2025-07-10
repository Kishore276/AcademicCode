const express = require('express');
const contestService = require('../services/contestService');

const router = express.Router();

// Get all contests
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let contests;
    try {
      contests = await contestService.getAllContests({ status, search });
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      contests = contestService.getContests();
      
      // Apply filters locally
      if (status) {
        contests = contests.filter(c => c.status === status);
      }
      if (search) {
        contests = contests.filter(c => 
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
        );
      }
    }
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ 
      message: 'Error fetching contests', 
      error: error.message 
    });
  }
});

// Get contest by ID
router.get('/:id', async (req, res) => {
  try {
    let contest;
    try {
      contest = await contestService.getContestByIdAPI(req.params.id);
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      contest = contestService.getContestById(req.params.id);
    }
    
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contest', error: error.message });
  }
});

// Create new contest
router.post('/', async (req, res) => {
  try {
    const contestData = req.body;
    
    const contest = contestService.createContest({
      ...contestData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Contest created successfully',
      contest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contest', error: error.message });
  }
});

// Update contest
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    
    const contest = contestService.updateContest(req.params.id, updates);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json({
      message: 'Contest updated successfully',
      contest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contest', error: error.message });
  }
});

// Delete contest
router.delete('/:id', async (req, res) => {
  try {
    const result = contestService.deleteContest(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contest', error: error.message });
  }
});

// Join contest
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // For now, we'll just return a mock response
    const participation = {
      id: Date.now().toString(),
      contestId: req.params.id,
      userId,
      joinedAt: new Date().toISOString(),
      status: 'active'
    };

    res.json({
      message: 'Successfully joined contest',
      participation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining contest', error: error.message });
  }
});

// Submit contest solution
router.post('/:id/submit', async (req, res) => {
  try {
    const { userId, problemId, code, language } = req.body;
    
    // For now, we'll just return a mock response
    const submission = {
      id: Date.now().toString(),
      contestId: req.params.id,
      problemId,
      userId,
      code,
      language,
      status: 'accepted', // Mock result
      score: 100,
      submittedAt: new Date().toISOString(),
      executionTime: Math.random() * 1000,
      memoryUsed: Math.random() * 10000
    };

    res.json({
      message: 'Solution submitted successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting solution', error: error.message });
  }
});

// Get contest leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    // For now, we'll return a mock leaderboard
    const leaderboard = [
      {
        rank: 1,
        userId: 'user1',
        username: 'TopCoder',
        score: 850,
        problemsSolved: 5,
        totalTime: 1200
      },
      {
        rank: 2,
        userId: 'user2',
        username: 'CodeMaster',
        score: 720,
        problemsSolved: 4,
        totalTime: 1500
      },
      {
        rank: 3,
        userId: 'user3',
        username: 'AlgorithmPro',
        score: 650,
        problemsSolved: 3,
        totalTime: 1800
      }
    ];

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

module.exports = router; 