import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Flag } from 'lucide-react';

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MCQQuestionProps {
  question: {
    id: string;
    title: string;
    description: string;
    options: MCQOption[];
    explanation?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeLimit?: number;
    points: number;
  };
  onAnswer: (questionId: string, selectedOption: string, isCorrect: boolean) => void;
  showResult?: boolean;
  selectedAnswer?: string;
  isDisabled?: boolean;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  onAnswer,
  showResult = false,
  selectedAnswer,
  isDisabled = false
}) => {
  const [selected, setSelected] = useState<string>(selectedAnswer || '');
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 0);

  const handleOptionSelect = (optionId: string) => {
    if (isDisabled || showResult) return;
    
    setSelected(optionId);
    const selectedOption = question.options.find(opt => opt.id === optionId);
    if (selectedOption) {
      onAnswer(question.id, optionId, selectedOption.isCorrect);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getOptionStyle = (option: MCQOption) => {
    if (!showResult && !selected) {
      return 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20';
    }
    
    if (!showResult && selected === option.id) {
      return 'border-primary-500 bg-primary-50 dark:bg-primary-900/20';
    }
    
    if (showResult) {
      if (option.isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      }
      if (selected === option.id && !option.isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      }
    }
    
    return 'border-gray-300 dark:border-gray-600';
  };

  const getOptionIcon = (option: MCQOption) => {
    if (!showResult) {
      return (
        <div className={`w-5 h-5 rounded-full border-2 ${
          selected === option.id 
            ? 'border-primary-500 bg-primary-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {selected === option.id && (
            <div className="w-full h-full rounded-full bg-white scale-50" />
          )}
        </div>
      );
    }
    
    if (option.isCorrect) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    if (selected === option.id && !option.isCorrect) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return (
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
    );
  };

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
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Question Description */}
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {question.description}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={isDisabled || showResult}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${getOptionStyle(option)} ${
              isDisabled || showResult ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            whileHover={!isDisabled && !showResult ? { scale: 1.01 } : {}}
            whileTap={!isDisabled && !showResult ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center space-x-3">
              {getOptionIcon(option)}
              <span className="flex-1 text-gray-900 dark:text-white">
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Explanation (shown after answer) */}
      {showResult && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Flag for Review */}
      {!showResult && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <Flag className="h-4 w-4" />
            <span>Flag for review</span>
          </button>
          
          {selected && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Answer selected
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MCQQuestion;