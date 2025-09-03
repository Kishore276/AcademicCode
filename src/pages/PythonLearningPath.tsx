import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Star, ChevronRight, BookOpen, Trophy, Target, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { motion } from 'framer-motion';

const PythonLearningPath = () => {
  const [activeModule, setActiveModule] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [code, setCode] = useState(`# Welcome to Python Programming!
def hello_world():
    """
    Your first Python function
    """
    print("Hello, World!")
    return "Welcome to Python!"

# Call the function
if __name__ == "__main__":
    message = hello_world()
    print(message)`);

  const learningPath = {
    id: 'python-fundamentals',
    title: 'Python Programming Mastery',
    description: 'Learn Python from scratch to advanced concepts. Master data science, web development, and automation with Python.',
    difficulty: 'Beginner to Advanced',
    duration: '10 weeks',
    problems: 95,
    enrolled: 23456,
    rating: 4.8,
    progress: 42,
    modules: [
      {
        id: 1,
        title: 'Python Basics & Syntax',
        description: 'Learn Python fundamentals, variables, data types, and control structures',
        problems: 20,
        completed: 20,
        duration: '1.5 weeks',
        topics: ['Variables', 'Data Types', 'Lists', 'Dictionaries', 'Control Flow'],
        problems_list: [
          {
            id: 1,
            title: 'Hello Python',
            description: 'Write your first Python program and understand basic syntax.',
            difficulty: 'Easy',
            points: 10,
            completed: true
          },
          {
            id: 2,
            title: 'Working with Lists',
            description: 'Learn list operations, indexing, and list comprehensions.',
            difficulty: 'Easy',
            points: 15,
            completed: true
          },
          {
            id: 3,
            title: 'Dictionary Operations',
            description: 'Master dictionary creation, access, and manipulation.',
            difficulty: 'Medium',
            points: 20,
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: 'Functions & Modules',
        description: 'Master functions, lambda expressions, and module creation',
        problems: 18,
        completed: 12,
        duration: '2 weeks',
        topics: ['Functions', 'Lambda', 'Modules', 'Packages', 'Decorators'],
        problems_list: [
          {
            id: 4,
            title: 'Function Basics',
            description: 'Create functions with parameters and return values.',
            difficulty: 'Easy',
            points: 20,
            completed: true
          },
          {
            id: 5,
            title: 'Lambda Functions',
            description: 'Use lambda functions for functional programming.',
            difficulty: 'Medium',
            points: 25,
            completed: false
          }
        ]
      },
      {
        id: 3,
        title: 'Object-Oriented Programming',
        description: 'Learn classes, objects, inheritance, and advanced OOP concepts',
        problems: 22,
        completed: 8,
        duration: '2.5 weeks',
        topics: ['Classes', 'Objects', 'Inheritance', 'Polymorphism', 'Magic Methods'],
        problems_list: [
          {
            id: 6,
            title: 'Create a Class',
            description: 'Define a Person class with attributes and methods.',
            difficulty: 'Medium',
            points: 30,
            completed: false
          }
        ]
      },
      {
        id: 4,
        title: 'Data Science with Python',
        description: 'NumPy, Pandas, Matplotlib, and data analysis',
        problems: 20,
        completed: 0,
        duration: '2 weeks',
        topics: ['NumPy', 'Pandas', 'Matplotlib', 'Data Analysis', 'Jupyter'],
        problems_list: [
          {
            id: 7,
            title: 'NumPy Arrays',
            description: 'Work with NumPy arrays and mathematical operations.',
            difficulty: 'Medium',
            points: 35,
            completed: false
          }
        ]
      },
      {
        id: 5,
        title: 'Web Development & APIs',
        description: 'Flask, Django basics, and API development',
        problems: 15,
        completed: 0,
        duration: '2 weeks',
        topics: ['Flask', 'Django', 'REST APIs', 'Web Scraping', 'Requests'],
        problems_list: [
          {
            id: 8,
            title: 'Flask Web App',
            description: 'Create a simple web application using Flask.',
            difficulty: 'Hard',
            points: 45,
            completed: false
          }
        ]
      }
    ]
  };

  const getModuleStatus = (module: any) => {
    if (module.completed === module.problems) return 'completed';
    if (module.completed > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'in-progress': return <Play className="h-5 w-5 text-warning-500" />;
      default: return <div className="h-5 w-5 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-success-500 bg-success-50 dark:bg-success-900/20';
      case 'in-progress': return 'border-warning-500 bg-warning-50 dark:bg-warning-900/20';
      default: return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'Medium': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'Hard': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const runCode = () => {
    console.log('Running Python code:', code);
  };

  const submitCode = () => {
    console.log('Submitting Python code:', code);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/learning-paths"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Learning Paths</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {learningPath.title}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{learningPath.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{learningPath.problems} problems</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{learningPath.enrolled.toLocaleString()} enrolled</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{learningPath.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    {learningPath.description}
                  </p>
                </div>
                
                <div className="text-right ml-8">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {learningPath.progress}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${learningPath.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              <motion.button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Learning Python
              </motion.button>
            </motion.div>

            {/* Current Problem */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Problem: Dictionary Operations
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor('Medium')}`}>
                  Medium • 20 points
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create a Python program that demonstrates various dictionary operations including creation, access, modification, and iteration.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Create a dictionary with student information (name, age, grades)</li>
                  <li>Add new students to the dictionary</li>
                  <li>Calculate average grade for each student</li>
                  <li>Find the student with the highest average grade</li>
                  <li>Use dictionary comprehension where appropriate</li>
                </ul>
              </div>

              <CodeEditor
                language="python"
                value={code}
                onChange={setCode}
                onRun={runCode}
                onSubmit={submitCode}
                height="400px"
              />
            </motion.div>

            {/* Modules */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Modules</h2>
              
              {learningPath.modules.map((module, index) => {
                const status = getModuleStatus(module);
                return (
                  <motion.div
                    key={module.id}
                    className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg ${getStatusColor(status)} ${
                      activeModule === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setActiveModule(index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Module {module.id}: {module.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {module.duration}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {module.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {module.completed}/{module.problems} problems completed
                          </div>
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {Math.round((module.completed / module.problems) * 100)}% complete
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(module.completed / module.problems) * 100}%` }}
                            transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Problems Solved</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">40/95</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Modules Completed</span>
                  <span className="font-semibold text-success-600 dark:text-success-400">2/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Time Spent</span>
                  <span className="font-semibold text-gray-900 dark:text-white">25h 30m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Current Streak</span>
                  <span className="font-semibold text-warning-600 dark:text-warning-400">15 days</span>
                </div>
              </div>
            </motion.div>

            {/* Python Resources */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Python Resources</h3>
              
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="font-medium text-blue-900 dark:text-blue-100">Python.org Documentation</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Official Python documentation and tutorials</div>
                </a>
                
                <a href="#" className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="font-medium text-blue-900 dark:text-blue-100">Python Package Index (PyPI)</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Discover and install Python packages</div>
                </a>
                
                <a href="#" className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="font-medium text-blue-900 dark:text-blue-100">Real Python Tutorials</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">In-depth Python tutorials and guides</div>
                </a>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Python Achievements</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-xl">
                  <Trophy className="h-6 w-6 text-success-600" />
                  <div>
                    <div className="font-medium text-success-900 dark:text-success-100">Python Basics Master</div>
                    <div className="text-sm text-success-700 dark:text-success-300">Completed Python basics module</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">Function Expert</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Mastered Python functions</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">OOP Practitioner</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Started OOP module</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonLearningPath;