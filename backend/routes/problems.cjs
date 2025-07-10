const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const problemsFile = path.join(__dirname, '../data/problems.json');

function readProblems() {
  if (!fs.existsSync(problemsFile)) return [];
  return JSON.parse(fs.readFileSync(problemsFile, 'utf-8'));
}
function writeProblems(problems) {
  fs.writeFileSync(problemsFile, JSON.stringify(problems, null, 2));
}

router.get('/', (req, res) => {
  res.json(readProblems());
});
router.get('/:id', (req, res) => {
  const problems = readProblems();
  const problem = problems.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  res.json(problem);
});
router.post('/', (req, res) => {
  const problems = readProblems();
  const newProblem = { ...req.body, id: Date.now().toString() };
  problems.push(newProblem);
  writeProblems(problems);
  res.status(201).json(newProblem);
});
router.put('/:id', (req, res) => {
  let problems = readProblems();
  const idx = problems.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Problem not found' });
  problems[idx] = { ...problems[idx], ...req.body };
  writeProblems(problems);
  res.json(problems[idx]);
});
router.delete('/:id', (req, res) => {
  let problems = readProblems();
  problems = problems.filter(p => p.id !== req.params.id);
  writeProblems(problems);
  res.json({ success: true });
});

module.exports = router; 