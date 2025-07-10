import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Clock, Users, Star, ChevronRight, BookOpen, Trophy, Target, Zap, Brain, Code2 } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  problems: number;
  enrolled: number;
  rating: number;
  category: string;
  tags: string[];
  progress?: number;
  icon: any;
  color: string;
}

const LearningPathsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const learningPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Data Structures Fundamentals',
      description: 'Master the essential data structures every programmer should know. From arrays to trees, build a solid foundation.',
      difficulty: 'Beginner',
      duration: '4 weeks',
      problems: 45,
      enrolled: 12847,
      rating: 4.8,
      category: 'Data Structures',
      tags: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
      progress: 65,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2',
      title: 'Algorithm Design Patterns',
      description: 'Learn common algorithmic patterns and techniques used in competitive programming and technical interviews.',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      problems: 72,
      enrolled: 8934,
      rating: 4.9,
      category: 'Algorithms',
      tags: ['Two Pointers', 'Sliding Window', 'Binary Search'],
      progress: 30,
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      title: 'Dynamic Programming Mastery',
      description: 'Conquer one of the most challenging topics in programming with step-by-step guidance and practice.',
      difficulty: 'Advanced',
      duration: '8 weeks',
      problems: 89,
      enrolled: 5672,
      rating: 4.7,
      category: 'Dynamic Programming',
      tags: ['Memoization', 'Tabulation', 'Optimization'],
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: '4',
      title: 'Graph Theory & Algorithms',
      description: 'Explore the fascinating world of graphs, from basic traversals to advanced algorithms like shortest paths.',
      difficulty: 'Intermediate',
      duration: '5 weeks',
      problems: 56,
      enrolled: 7234,
      rating: 4.6,
      category: 'Graph Theory',
      tags: ['DFS', 'BFS', 'Shortest Path', 'MST'],
      progress: 80,
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '5',
      title: 'String Processing & Algorithms',
      description: 'Master string manipulation, pattern matching, and advanced string algorithms for text processing.',
      difficulty: 'Intermediate',
      duration: '4 weeks',
      problems: 38,
      enrolled: 6789,
      rating: 4.5,
      category: 'Strings',
      tags: ['Pattern Matching', 'KMP', 'Trie', 'Suffix Arrays'],
      icon: Code2,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: '6',
      title: 'Competitive Programming Bootcamp',
      description: 'Intensive training for competitive programming contests with advanced techniques and problem-solving strategies.',
      difficulty: 'Advanced',
      duration: '12 weeks',
      problems: 150,
      enrolled: 3456,
      rating: 4.9,
      category: 'Competitive Programming',
      tags: ['Contest Strategies', 'Advanced Algorithms', 'Math'],
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const categories = ['All', 'Data Structures', 'Algorithms', 'Dynamic Programming', 'Graph Theory', 'Strings', 'Competitive Programming'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredPaths = learningPaths.filter(path => {
    const matchesCategory = selectedCategory === 'All' || path.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || path.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'Intermediate': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'Advanced': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-lg animate-float">
              <Map className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Learning Paths
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Structured learning journeys designed to take you from beginner to expert in specific programming domains
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPaths.length} learning paths available
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaths.map((path, index) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.id}
                to={`/learning-paths/${path.id}`}
                className="group block animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${path.color} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                      {path.title}
                    </h3>
                    
                    {path.progress !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-white/80 text-sm mb-1">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-500"
                            style={{ width: `${path.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {path.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{path.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{path.problems} problems</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{path.enrolled.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {path.rating}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {path.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {path.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-xs">
                          +{path.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Map className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No learning paths found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathsPage;