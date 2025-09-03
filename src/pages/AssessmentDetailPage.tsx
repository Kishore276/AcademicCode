import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, BookOpen, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import OnlineUsers from '../components/RealTimeFeatures/OnlineUsers';
import LiveCodeEditor from '../components/RealTimeFeatures/LiveCodeEditor';

const AssessmentDetailPage = () => {
  const { id } = useParams();
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const assessment = {
    id: '1',
    title: 'Data Structures Midterm Exam',
    course: 'CS 201 - Data Structures',
    instructor: 'Dr. Sarah Wilson',
    description: 'This midterm exam covers fundamental data structures including arrays, linked lists, stacks, queues, and basic tree operations. You will be tested on both theoretical concepts and practical implementation skills.',
    dueDate: '2024-01-25 23:59',
    duration: '2 hours',
    problemsCount: 5,
    maxScore: 100,
    status: 'active',
    timeRemaining: '2 days 5 hours',
    instructions: [
      'Read all questions carefully before starting',
      'You have 2 hours to complete all 5 problems',
      'Each problem has different point values as indicated',
      'You can save your progress and return later',
      'Submit before the deadline to avoid late penalties',
      'Academic integrity policies apply'
    ],
    problems: [
      {
        id: 1,
        title: 'Array Operations',
        points: 15,
        description: 'Implement basic array operations and analyze time complexity',
        difficulty: 'Easy'
      },
      {
        id: 2,
        title: 'Linked List Manipulation',
        points: 20,
        description: 'Create and manipulate singly and doubly linked lists',
        difficulty: 'Medium'
      },
      {
        id: 3,
        title: 'Stack and Queue Implementation',
        points: 25,
        description: 'Implement stack and queue using arrays and linked lists',
        difficulty: 'Medium'
      },
      {
        id: 4,
        title: 'Binary Tree Traversal',
        points: 25,
        description: 'Implement various tree traversal algorithms',
        difficulty: 'Hard'
      },
      {
        id: 5,
        title: 'Algorithm Analysis',
        points: 15,
        description: 'Analyze time and space complexity of given algorithms',
        difficulty: 'Medium'
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'Medium': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'Hard': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const handleStartAssessment = () => {
    setShowStartConfirmation(false);
    // Navigate to assessment taking interface
    console.log('Starting assessment...');
  };

  return (
    <div className="min-h-screen py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar with Online Users */}
      <aside className="hidden lg:block col-span-1">
        <OnlineUsers />
      </aside>
      {/* Main Content */}
      <div className="col-span-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/assessments"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors animate-slide-right"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Assessments</span>
          </Link>

          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                  {assessment.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{assessment.course}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{assessment.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{assessment.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{assessment.problems.length} problems</span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {assessment.description}
                </p>
              </div>

              <div className="text-right ml-8">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl mb-4">
                  <div className="text-2xl font-bold">{assessment.maxScore}</div>
                  <div className="text-sm opacity-90">Total Points</div>
                </div>
                
                {assessment.status === 'active' && (
                  <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-3">
                    <div className="text-success-600 dark:text-success-400 font-medium text-sm">
                      Time Remaining
                    </div>
                    <div className="text-success-900 dark:text-success-100 font-bold">
                      {assessment.timeRemaining}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {assessment.status === 'active' && (
              <button
                onClick={() => setShowStartConfirmation(true)}
                className="w-full bg-gradient-to-r from-success-500 to-emerald-500 hover:from-success-600 hover:to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Play className="h-6 w-6" />
                <span>Start Assessment</span>
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              <span>Instructions</span>
            </h2>
            <ul className="space-y-2">
              {assessment.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Problems Overview */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Problems Overview</h2>
            
            <div className="space-y-4">
              {assessment.problems.map((problem, index) => (
                <div
                  key={problem.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Problem {problem.id}: {problem.title}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {problem.points} points
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {problem.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Live Code Collaboration */}
            <div className="mt-8">
              <LiveCodeEditor
                roomId={`assessment-${id}`}
                language={language}
                value={code}
                onChange={setCode}
                showCollaboration={true}
                height="400px"
              />
            </div>
          </div>
        </div>

        {/* Start Confirmation Modal */}
        {showStartConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-warning-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Start Assessment?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Once you start, the timer will begin and you'll have {assessment.duration} to complete all problems. Make sure you're ready!
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStartConfirmation(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartAssessment}
                  className="flex-1 bg-gradient-to-r from-success-500 to-emerald-500 hover:from-success-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetailPage;