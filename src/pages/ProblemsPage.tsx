import React, { useState, useEffect } from 'react';
import { Search, Filter, Check, Clock, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { problemService } from '../services/dataService';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solved: boolean;
  acceptance: number;
  likes: number;
  tags: string[];
}

const ProblemsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProblems() {
      const allProblems = await problemService.getProblems();
      setProblems(allProblems);
    }
    fetchProblems();
  }, []);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = ['All', 'Arrays', 'Trees', 'Stack', 'Dynamic Programming', 'Backtracking', 'String'];

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'Medium': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'Hard': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <motion.div 
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (user?.role === 'teacher' || user?.role === 'admin') {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Problems are only available to students</h2>
          <p className="text-gray-600 dark:text-gray-300">Switch to a student account to view and solve practice problems.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Practice Problems
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sharpen your programming skills with our curated collection of coding challenges
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Problems List */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-x-auto border border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProblems.map((problem, index) => (
              <Link
                key={problem.id}
                to={`/problems/${problem.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {problem.solved ? (
                            <Check className="h-5 w-5 text-success-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {problem.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>{problem.category}</span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>{problem.likes}</span>
                        </span>
                        <span>{problem.acceptance}% acceptance</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            whileHover={{ scale: 1.05 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 ml-4 transition-colors" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {filteredProblems.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No problems found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;