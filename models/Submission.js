const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  result: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'terminated'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  testCases: [{
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    executionTime: Number,
    memoryUsed: Number
  }]
});

module.exports = mongoose.model('Submission', submissionSchema); 