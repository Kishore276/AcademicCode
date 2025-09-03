const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const submissionsFile = path.join(__dirname, '../data/submissions.json');

function readSubmissions() {
  if (!fs.existsSync(submissionsFile)) return [];
  return JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
}
function writeSubmissions(submissions) {
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
}

router.get('/', (req, res) => {
  res.json(readSubmissions());
});
router.get('/:id', (req, res) => {
  const submissions = readSubmissions();
  const submission = submissions.find(s => s.id === req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  res.json(submission);
});
router.post('/', (req, res) => {
  const submissions = readSubmissions();
  const newSubmission = { ...req.body, id: Date.now().toString() };
  submissions.push(newSubmission);
  writeSubmissions(submissions);
  res.status(201).json(newSubmission);
});
router.put('/:id', (req, res) => {
  let submissions = readSubmissions();
  const idx = submissions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Submission not found' });
  submissions[idx] = { ...submissions[idx], ...req.body };
  writeSubmissions(submissions);
  res.json(submissions[idx]);
});
router.delete('/:id', (req, res) => {
  let submissions = readSubmissions();
  submissions = submissions.filter(s => s.id !== req.params.id);
  writeSubmissions(submissions);
  res.json({ success: true });
});

module.exports = router; 