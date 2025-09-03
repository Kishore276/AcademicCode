const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

// Helper to read users
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}
// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// GET all users
router.get('/', (req, res) => {
  res.json(readUsers());
});
// GET user by id
router.get('/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});
// POST create user
router.post('/', (req, res) => {
  const users = readUsers();
  const newUser = { ...req.body, id: Date.now().toString() };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});
// PUT update user
router.put('/:id', (req, res) => {
  let users = readUsers();
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx] = { ...users[idx], ...req.body };
  writeUsers(users);
  res.json(users[idx]);
});
// DELETE user
router.delete('/:id', (req, res) => {
  let users = readUsers();
  users = users.filter(u => u.id !== req.params.id);
  writeUsers(users);
  res.json({ success: true });
});

module.exports = router; 