import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, Calendar, CheckCircle, AlertCircle, Play, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { motion } from 'framer-motion';

interface Assessment {
  id: string;
  title: string;
  course: string;
  instructor: string;
  instructorName: string;
  dueDate: string;
  duration: number;
  problems: string[];
  mcqQuestions: string[];
  theoryQuestions: string[];
  maxScore: number;
  status: 'upcoming' | 'active' | 'submitted' | 'graded';
  score?: number;
  timeRemaining?: string;
  assignedTo: string[];
}

const AssessmentsPage = () => {
  const [filter, setFilter] = useState('all');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAssessments() {
      const all = await dataService.getAssessments();
      setAssessments(all);
      if (user?.id) {
        const student = all.filter((a: any) => a.assignedTo && a.assignedTo.includes(user.id));
        setAssessments(student);
      }
    }
    fetchAssessments();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-100 dark:bg-success-900/30 border-success-200 dark:border-success-800';
      case 'upcoming': return 'text-primary-600 bg-primary-100 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800';
      case 'submitted': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800';
      case 'graded': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const calculateTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days ${hours} hours`;
    return `${hours} hours`;
  };

  const filteredAssessments = assessments.filter(assessment => {
    if (filter === 'all') return true;
    return assessment.status === filter;
  });

  const filters = [
    { value: 'all', label: 'All Assessments' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' }
  ];

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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-lg"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ClipboardList className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            My Assessments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            View and manage your course assessments, track deadlines, and monitor your progress
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filterOption) => (
              <motion.button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filter === filterOption.value
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterOption.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredAssessments.map((assessment, index) => (
            <Link
              key={assessment.id}
              to={`/assessments/${assessment.id}`}
              className="group block"
            >
              <motion.div
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 ${getStatusColor(assessment.status)} overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${getStatusColor(assessment.status)}`}>
                        {getStatusIcon(assessment.status)}
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {assessment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {assessment.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{assessment.course}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Instructor: {assessment.instructorName}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        {assessment.problems.length + assessment.mcqQuestions.length + assessment.theoryQuestions.length}
                      </span> questions
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{assessment.maxScore}</span> max points
                    </div>
                  </div>

                  {/* Status-specific content */}
                  {assessment.status === 'active' && (
                    <motion.div 
                      className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4 mb-4"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(34, 197, 94, 0.4)",
                          "0 0 0 10px rgba(34, 197, 94, 0)",
                          "0 0 0 0 rgba(34, 197, 94, 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-success-600" />
                        <span className="font-medium text-success-900 dark:text-success-100">
                          Time Remaining: {calculateTimeRemaining(assessment.dueDate)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {assessment.status === 'graded' && assessment.score !== undefined && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Your Score:</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {assessment.score}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">/{assessment.maxScore}</span>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {Math.round((assessment.score / assessment.maxScore) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {assessment.status === 'submitted' && (
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-warning-600" />
                        <span className="font-medium text-warning-900 dark:text-warning-100">
                          Submitted - Awaiting grading
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="pt-4">
                    <motion.div 
                      className={`w-full py-3 px-4 rounded-xl font-medium text-center transition-all duration-300 ${
                        assessment.status === 'active'
                          ? 'bg-gradient-to-r from-success-500 to-emerald-500 hover:from-success-600 hover:to-emerald-600 text-white shadow-lg'
                          : assessment.status === 'upcoming'
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {assessment.status === 'active' && 'Start Assessment'}
                      {assessment.status === 'upcoming' && 'View Details'}
                      {assessment.status === 'submitted' && 'View Submission'}
                      {assessment.status === 'graded' && 'View Results'}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No assessments found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? 'You have no assessments at the moment.' 
                : `You have no ${filter} assessments.`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsPage;