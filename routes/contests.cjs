const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const contestsFile = path.join(__dirname, '../data/contests.json');

function readContests() {
  if (!fs.existsSync(contestsFile)) return [];
  return JSON.parse(fs.readFileSync(contestsFile, 'utf-8'));
}
function writeContests(contests) {
  fs.writeFileSync(contestsFile, JSON.stringify(contests, null, 2));
}

router.get('/', (req, res) => {
  res.json(readContests());
});
router.get('/:id', (req, res) => {
  const contests = readContests();
  const contest = contests.find(c => c.id === req.params.id);
  if (!contest) return res.status(404).json({ error: 'Contest not found' });
  res.json(contest);
});
router.post('/', (req, res) => {
  const contests = readContests();
  const newContest = { ...req.body, id: Date.now().toString() };
  contests.push(newContest);
  writeContests(contests);
  res.status(201).json(newContest);
});
router.put('/:id', (req, res) => {
  let contests = readContests();
  const idx = contests.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Contest not found' });
  contests[idx] = { ...contests[idx], ...req.body };
  writeContests(contests);
  res.json(contests[idx]);
});
router.delete('/:id', (req, res) => {
  let contests = readContests();
  contests = contests.filter(c => c.id !== req.params.id);
  writeContests(contests);
  res.json({ success: true });
});

module.exports = router; 