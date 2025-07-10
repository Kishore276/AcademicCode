import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, FileText, Trophy, Clock, Users, Star, Filter, Search } from 'lucide-react';
import RealTimeCompiler from '../components/Compiler/RealTimeCompiler';
import MCQQuestion from '../components/Problems/MCQQuestion';
import TheoryQuestion from '../components/Problems/TheoryQuestion';
import OnlineUsers from '../components/RealTimeFeatures/OnlineUsers';
import LiveCodeEditor from '../components/RealTimeFeatures/LiveCodeEditor';
import { useAuth } from '../contexts/AuthContext';

const PracticeArena = () => {
  const { user, isAuthenticated } = useAuth ? useAuth() : { user: null, isAuthenticated: false };
  const [activeTab, setActiveTab] = useState('coding');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const codingProblems = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy' as const,
      category: 'Arrays',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁴'],
      starterCode: {
        javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
        python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
        java: 'public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}'
      },
      points: 100,
      timeLimit: 30,
      solved: false,
      likes: 1247,
      acceptance: 85.2
    },
    {
      id: '2',
      title: 'Binary Tree Inorder Traversal',
      difficulty: 'Medium' as const,
      category: 'Trees',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
      examples: [
        { input: 'root = [1,null,2,3]', output: '[1,3,2]' }
      ],
      constraints: ['The number of nodes in the tree is in the range [0, 100]'],
      starterCode: {
        javascript: 'function inorderTraversal(root) {\n    // Your code here\n}',
        python: 'def inorder_traversal(root):\n    # Your code here\n    pass',
        java: 'public List<Integer> inorderTraversal(TreeNode root) {\n    // Your code here\n}'
      },
      points: 200,
      timeLimit: 45,
      solved: true,
      likes: 892,
      acceptance: 67.8
    }
  ];

  const mcqQuestions = [
    {
      id: 'mcq1',
      title: 'Time Complexity Analysis',
      description: 'What is the time complexity of the following code snippet?\n\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++) {\n        console.log(i + j);\n    }\n}',
      options: [
        { id: 'a', text: 'O(n)', isCorrect: false },
        { id: 'b', text: 'O(n²)', isCorrect: true },
        { id: 'c', text: 'O(n log n)', isCorrect: false },
        { id: 'd', text: 'O(2^n)', isCorrect: false }
      ],
      explanation: 'The nested loops each run n times, resulting in n × n = n² operations, giving us O(n²) time complexity.',
      difficulty: 'Medium' as const,
      points: 50,
      timeLimit: 120
    },
    {
      id: 'mcq2',
      title: 'Data Structure Properties',
      description: 'Which data structure follows the Last In, First Out (LIFO) principle?',
      options: [
        { id: 'a', text: 'Queue', isCorrect: false },
        { id: 'b', text: 'Stack', isCorrect: true },
        { id: 'c', text: 'Array', isCorrect: false },
        { id: 'd', text: 'Linked List', isCorrect: false }
      ],
      explanation: 'A stack follows the LIFO principle where the last element added is the first one to be removed.',
      difficulty: 'Easy' as const,
      points: 25,
      timeLimit: 60
    }
  ];

  const theoryQuestions = [
    {
      id: 'theory1',
      title: 'Algorithm Design Principles',
      description: 'Explain the divide and conquer algorithm design paradigm. Provide an example of a well-known algorithm that uses this approach and analyze its time complexity.',
      maxWords: 300,
      timeLimit: 20,
      points: 100,
      difficulty: 'Hard' as const,
      rubric: [
        { criteria: 'Clear explanation of divide and conquer', points: 40 },
        { criteria: 'Relevant example with correct analysis', points: 40 },
        { criteria: 'Time complexity analysis', points: 20 }
      ]
    },
    {
      id: 'theory2',
      title: 'Object-Oriented Programming',
      description: 'Compare and contrast inheritance and composition in object-oriented programming. When would you choose one over the other?',
      maxWords: 250,
      timeLimit: 15,
      points: 75,
      difficulty: 'Medium' as const,
      rubric: [
        { criteria: 'Clear explanation of both concepts', points: 30 },
        { criteria: 'Comparison with pros and cons', points: 30 },
        { criteria: 'Practical examples and use cases', points: 15 }
      ]
    }
  ];

  const tabs = [
    { id: 'coding', label: 'Coding Problems', icon: Code, count: codingProblems.length },
    { id: 'mcq', label: 'MCQ Questions', icon: Brain, count: mcqQuestions.length },
    { id: 'theory', label: 'Theory Questions', icon: FileText, count: theoryQuestions.length },
    { id: 'contests', label: 'Live Contests', icon: Trophy, count: 3 }
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  const categories = ['all', 'Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Strings', 'Math'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const handleMCQAnswer = (questionId: string, selectedOption: string, isCorrect: boolean) => {
    console.log('MCQ Answer:', { questionId, selectedOption, isCorrect });
  };

  const handleTheoryAnswer = (questionId: string, answer: string) => {
    console.log('Theory Answer:', { questionId, answer });
  };

  // Error boundary for debugging
  try {
    if (!isAuthenticated || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign in to access Practice Arena</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to use the Practice Arena features.</p>
            <a href="/login" className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">Go to Login</a>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with Online Users */}
        <aside className="hidden lg:block col-span-1">
          <OnlineUsers />
        </aside>
        {/* Main Content */}
        <div className="col-span-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                Practice Arena
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Sharpen your programming skills with coding problems, MCQs, theory questions, and live contests
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl mb-8 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex overflow-x-auto">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Filters */}
            {(activeTab === 'coding' || activeTab === 'mcq' || activeTab === 'theory') && (
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Difficulty Filter */}
                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty === 'all' ? 'All Difficulties' : difficulty}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    {activeTab === 'coding' && (
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activeTab === 'coding' && `${codingProblems.length} problems available`}
                    {activeTab === 'mcq' && `${mcqQuestions.length} questions available`}
                    {activeTab === 'theory' && `${theoryQuestions.length} questions available`}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'coding' && (
                <LiveCodeEditor
                  roomId="practice-arena"
                  language={language}
                  value={code}
                  onChange={setCode}
                  showCollaboration={true}
                  height="400px"
                />
              )}
              {activeTab === 'mcq' && (
                <div className="space-y-6">
                  {mcqQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <MCQQuestion
                        question={question}
                        onAnswer={handleMCQAnswer}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              {activeTab === 'theory' && (
                <div className="space-y-6">
                  {theoryQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TheoryQuestion
                        question={question}
                        onAnswer={handleTheoryAnswer}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              {activeTab === 'contests' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center"
                >
                  <Trophy className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Live Contests
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Compete with other students in real-time programming contests
                  </p>
                  <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    View Active Contests
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Practice Arena error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">An error occurred in the Practice Arena. Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }
};

export default PracticeArena;