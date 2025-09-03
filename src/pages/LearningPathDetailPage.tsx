import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, BookOpen, CheckCircle, Circle, Play, Trophy, Target } from 'lucide-react';

const LearningPathDetailPage = () => {
  const { id } = useParams();
  const [activeModule, setActiveModule] = useState(0);

  const learningPath = {
    id: '1',
    title: 'Data Structures Fundamentals',
    description: 'Master the essential data structures every programmer should know. From arrays to trees, build a solid foundation for advanced programming concepts.',
    difficulty: 'Beginner',
    duration: '4 weeks',
    problems: 45,
    enrolled: 12847,
    rating: 4.8,
    progress: 65,
    modules: [
      {
        id: 1,
        title: 'Arrays & Strings',
        description: 'Learn the basics of arrays and string manipulation',
        problems: 12,
        completed: 12,
        duration: '1 week',
        topics: ['Array Basics', 'Two Pointers', 'String Operations', 'Sliding Window']
      },
      {
        id: 2,
        title: 'Linked Lists',
        description: 'Understand linked list operations and implementations',
        problems: 10,
        completed: 7,
        duration: '1 week',
        topics: ['Singly Linked Lists', 'Doubly Linked Lists', 'Circular Lists', 'List Reversal']
      },
      {
        id: 3,
        title: 'Stacks & Queues',
        description: 'Master stack and queue data structures',
        problems: 8,
        completed: 0,
        duration: '1 week',
        topics: ['Stack Operations', 'Queue Operations', 'Priority Queues', 'Deque']
      },
      {
        id: 4,
        title: 'Trees & Binary Trees',
        description: 'Explore tree structures and traversal algorithms',
        problems: 15,
        completed: 0,
        duration: '1 week',
        topics: ['Binary Trees', 'Tree Traversal', 'BST Operations', 'Tree Properties']
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
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-success-500 bg-success-50 dark:bg-success-900/20';
      case 'in-progress': return 'border-warning-500 bg-warning-50 dark:bg-warning-900/20';
      default: return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/learning-paths"
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors animate-slide-right"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Learning Paths</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                    {learningPath.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    {learningPath.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
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
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {learningPath.progress}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${learningPath.progress}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Continue Learning
              </button>
            </div>

            {/* Modules */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Modules</h2>
              
              {learningPath.modules.map((module, index) => {
                const status = getModuleStatus(module);
                return (
                  <div
                    key={module.id}
                    className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg ${getStatusColor(status)} ${
                      activeModule === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setActiveModule(index)}
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                          <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {Math.round((module.completed / module.problems) * 100)}% complete
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(module.completed / module.problems) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Problems Solved</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">19/45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Modules Completed</span>
                  <span className="font-semibold text-success-600 dark:text-success-400">1/4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Time Spent</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12h 30m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Streak</span>
                  <span className="font-semibold text-warning-600 dark:text-warning-400">7 days</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-left" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-xl">
                  <Trophy className="h-6 w-6 text-success-600" />
                  <div>
                    <div className="font-medium text-success-900 dark:text-success-100">First Module</div>
                    <div className="text-sm text-success-700 dark:text-success-300">Completed your first module</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <Target className="h-6 w-6 text-primary-600" />
                  <div>
                    <div className="font-medium text-primary-900 dark:text-primary-100">Problem Solver</div>
                    <div className="text-sm text-primary-700 dark:text-primary-300">Solved 10 problems</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Paths */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Next</h3>
              
              <div className="space-y-3">
                <Link
                  to="/learning-paths/2"
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Algorithm Design Patterns</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Intermediate • 6 weeks</div>
                </Link>
                
                <Link
                  to="/learning-paths/4"
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Graph Theory & Algorithms</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Intermediate • 5 weeks</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetailPage;