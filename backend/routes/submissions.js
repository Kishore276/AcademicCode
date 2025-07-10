const express = require('express');
const submissionService = require('../services/submissionService');

const router = express.Router();

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const { user, problem, status, language } = req.query;
    
    let submissions;
    try {
      submissions = await submissionService.getAllSubmissions({ user, problem, status, language });
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      submissions = submissionService.getSubmissions();
      
      // Apply filters locally
      if (user) {
        submissions = submissions.filter(s => s.userId === user);
      }
      if (problem) {
        submissions = submissions.filter(s => s.problemId === problem);
      }
      if (status) {
        submissions = submissions.filter(s => s.status === status);
      }
      if (language) {
        submissions = submissions.filter(s => s.language === language);
      }
    }
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      message: 'Error fetching submissions', 
      error: error.message 
    });
  }
});

// Get submission by ID
router.get('/:id', async (req, res) => {
  try {
    let submission;
    try {
      submission = await submissionService.getSubmissionByIdAPI(req.params.id);
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      submission = submissionService.getSubmissionById(req.params.id);
    }
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
});

// Create new submission
router.post('/', async (req, res) => {
  try {
    const { user, problem, contest, code, language } = req.body;
    
    const submission = submissionService.createSubmission({
      userId: user,
      problemId: problem,
      contestId: contest,
      code,
      language,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    });

    res.status(201).json({
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
});

// Update submission
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    
    const submission = submissionService.updateSubmission(req.params.id, updates);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({
      message: 'Submission updated successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating submission', error: error.message });
  }
});

// Delete submission
router.delete('/:id', async (req, res) => {
  try {
    const result = submissionService.deleteSubmission(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting submission', error: error.message });
  }
});

// Get user submissions
router.get('/user/:userId', async (req, res) => {
  try {
    const submissions = submissionService.getSubmissions().filter(
      s => s.userId === req.params.userId
    );
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user submissions', error: error.message });
  }
});

// Get problem submissions
router.get('/problem/:problemId', async (req, res) => {
  try {
    const submissions = submissionService.getSubmissions().filter(
      s => s.problemId === req.params.problemId
    );
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem submissions', error: error.message });
  }
});

// Get submission stats
router.get('/stats/overview', async (req, res) => {
  try {
    const submissions = submissionService.getSubmissions();
    
    const stats = {
      total: submissions.length,
      accepted: submissions.filter(s => s.status === 'accepted').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
      pending: submissions.filter(s => s.status === 'pending').length,
      languages: submissions.reduce((acc, s) => {
        acc[s.language] = (acc[s.language] || 0) + 1;
        return acc;
      }, {})
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission stats', error: error.message });
  }
});

// Rejudge submission
router.post('/:id/rejudge', async (req, res) => {
  try {
    const submission = submissionService.getSubmissionById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Mock rejudge process
    const updatedSubmission = submissionService.updateSubmission(req.params.id, {
      status: 'accepted', // Mock result
      score: 100,
      executionTime: Math.random() * 1000,
      memoryUsed: Math.random() * 10000,
      rejudgedAt: new Date().toISOString()
    });

    res.json({
      message: 'Submission rejudged successfully',
      submission: updatedSubmission
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejudging submission', error: error.message });
  }
});

module.exports = router; 