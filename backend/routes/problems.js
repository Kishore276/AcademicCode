const express = require('express');
const problemService = require('../services/problemService');

const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
  try {
    const { difficulty, category, search } = req.query;
    
    let problems;
    try {
      problems = await problemService.getAllProblems({ difficulty, category, search });
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      problems = problemService.getProblems();
      
      // Apply filters locally
      if (difficulty) {
        problems = problems.filter(p => p.difficulty === difficulty);
      }
      if (category) {
        problems = problems.filter(p => p.category === category);
      }
      if (search) {
        problems = problems.filter(p => 
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }
    }
    
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ 
      message: 'Error fetching problems', 
      error: error.message 
    });
  }
});

// Get problem by ID
router.get('/:id', async (req, res) => {
  try {
    let problem;
    try {
      problem = await problemService.getProblemByIdAPI(req.params.id);
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      problem = problemService.getProblemById(req.params.id);
    }
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem', error: error.message });
  }
});

// Create new problem
router.post('/', async (req, res) => {
  try {
    const problemData = req.body;
    
    const problem = problemService.createProblem({
      ...problemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating problem', error: error.message });
  }
});

// Update problem
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    
    const problem = problemService.updateProblem(req.params.id, updates);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({
      message: 'Problem updated successfully',
      problem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating problem', error: error.message });
  }
});

// Delete problem
router.delete('/:id', async (req, res) => {
  try {
    const result = problemService.deleteProblem(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting problem', error: error.message });
  }
});

// Submit solution
router.post('/:id/submit', async (req, res) => {
  try {
    const { code, language, userId } = req.body;
    
    // For now, we'll just return a mock response
    // In a real implementation, you'd run the code and check against test cases
    const submission = {
      id: Date.now().toString(),
      problemId: req.params.id,
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

module.exports = router; 