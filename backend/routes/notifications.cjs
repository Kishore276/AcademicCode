const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const notificationsFile = path.join(__dirname, '../data/notifications.json');

function readNotifications() {
  if (!fs.existsSync(notificationsFile)) return [];
  return JSON.parse(fs.readFileSync(notificationsFile, 'utf-8'));
}
function writeNotifications(notifications) {
  fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2));
}

router.get('/', (req, res) => {
  res.json(readNotifications());
});
router.post('/', (req, res) => {
  const notifications = readNotifications();
  const newNotification = { ...req.body, id: Date.now().toString() };
  notifications.push(newNotification);
  writeNotifications(notifications);
  res.status(201).json(newNotification);
});
router.delete('/:id', (req, res) => {
  let notifications = readNotifications();
  notifications = notifications.filter(n => n.id !== req.params.id);
  writeNotifications(notifications);
  res.json({ success: true });
});

module.exports = router; 