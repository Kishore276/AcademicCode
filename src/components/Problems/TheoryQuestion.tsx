import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save, FileText, Upload, Download } from 'lucide-react';

interface TheoryQuestionProps {
  question: {
    id: string;
    title: string;
    description: string;
    maxWords?: number;
    timeLimit?: number;
    points: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    attachments?: string[];
    rubric?: {
      criteria: string;
      points: number;
    }[];
  };
  onAnswer: (questionId: string, answer: string) => void;
  initialAnswer?: string;
  isDisabled?: boolean;
  showWordCount?: boolean;
}

const TheoryQuestion: React.FC<TheoryQuestionProps> = ({
  question,
  onAnswer,
  initialAnswer = '',
  isDisabled = false,
  showWordCount = true
}) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setIsSaved(false);
  };

  const handleSave = () => {
    onAnswer(question.id, answer);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const isOverWordLimit = question.maxWords && wordCount > question.maxWords;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {question.title}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {question.points} points
            </span>
          </div>
        </div>
        
        {question.timeLimit && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Time limit: {question.timeLimit} min</span>
          </div>
        )}
      </div>

      {/* Question Description */}
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {question.description}
        </p>
      </div>

      {/* Attachments */}
      {question.attachments && question.attachments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Attachments</h4>
          <div className="space-y-2">
            {question.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{attachment}</span>
                <button className="ml-auto text-primary-600 hover:text-primary-700 text-sm">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer Textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Answer
        </label>
        <textarea
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          disabled={isDisabled}
          placeholder="Type your answer here..."
          className={`w-full h-64 p-4 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
            isOverWordLimit 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
        />
      </div>

      {/* Word Count and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showWordCount && (
            <span className={`text-sm ${
              isOverWordLimit 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {wordCount} {question.maxWords && `/ ${question.maxWords}`} words
            </span>
          )}
          
          {isSaved && (
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Saved
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* Handle file upload */}}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Attach File</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isDisabled || isOverWordLimit}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Answer</span>
          </button>
        </div>
      </div>

      {/* Rubric */}
      {question.rubric && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Grading Rubric</h4>
          <div className="space-y-2">
            {question.rubric.map((criterion, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">{criterion.criteria}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{criterion.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning for word limit */}
      {isOverWordLimit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-sm text-red-700 dark:text-red-300">
            Your answer exceeds the word limit of {question.maxWords} words. Please reduce the length.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TheoryQuestion;