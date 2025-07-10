import React, { useState } from 'react';
import { Users, ClipboardList, BookOpen, BarChart3, Plus, Calendar, Clock, CheckCircle, Edit, Trash2, Eye, Upload } from 'lucide-react';
import TestCreator from '../components/TestCreator';
import PDFUpload from '../components/PDFUpload';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTestCreator, setShowTestCreator] = useState(false);

  const stats = [
    { label: 'My Students', value: '156', change: '+8', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Tests', value: '12', change: '+3', icon: ClipboardList, color: 'from-green-500 to-emerald-500' },
    { label: 'Problems Created', value: '47', change: '+5', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Avg. Score', value: '78%', change: '+2%', icon: BarChart3, color: 'from-orange-500 to-red-500' }
  ];

  const recentTests = [
    {
      id: 1,
      title: 'Java Fundamentals Quiz',
      course: 'CS 101',
      dueDate: '2024-01-25',
      submissions: 45,
      totalStudents: 50,
      status: 'active',
      language: 'java'
    },
    {
      id: 2,
      title: 'Python Data Structures',
      course: 'CS 201',
      dueDate: '2024-01-20',
      submissions: 32,
      totalStudents: 35,
      status: 'grading',
      language: 'python'
    },
    {
      id: 3,
      title: 'JavaScript Algorithms',
      course: 'CS 301',
      dueDate: '2024-01-15',
      submissions: 28,
      totalStudents: 30,
      status: 'completed',
      language: 'javascript'
    }
  ];

  const studentProgress = [
    { name: 'Alice Johnson', course: 'CS 201', progress: 85, lastActive: '2 hours ago', status: 'excellent', language: 'Python' },
    { name: 'Bob Smith', course: 'CS 301', progress: 72, lastActive: '1 day ago', status: 'good', language: 'JavaScript' },
    { name: 'Carol Davis', course: 'CS 101', progress: 45, lastActive: '3 days ago', status: 'needs-attention', language: 'Java' },
    { name: 'David Wilson', course: 'CS 201', progress: 91, lastActive: '1 hour ago', status: 'excellent', language: 'Python' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'grading': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'completed': return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      case 'excellent': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'good': return 'text-primary-600 bg-primary-100 dark:bg-primary-900/30';
      case 'needs-attention': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case 'java': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'python': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'javascript': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tests', label: 'Tests', icon: ClipboardList },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'upload', label: 'Upload PDF', icon: Upload }
  ];

  const deleteTest = (id: number) => {
    toast.success('Test deleted successfully');
  };

  const duplicateTest = (id: number) => {
    toast.success('Test duplicated successfully');
  };

  if (showTestCreator) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowTestCreator(false)}
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <span>← Back to Dashboard</span>
            </button>
          </div>
          <TestCreator />
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your courses, create tests, and track student progress
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
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-success-600 dark:text-success-400">
                        +{stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tests</h3>
                  <motion.button 
                    onClick={() => setShowTestCreator(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    New Test
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {recentTests.map((test, index) => (
                    <motion.div 
                      key={test.id} 
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{test.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(test.language)}`}>
                            {test.language}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {test.course} • Due: {test.dueDate}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {test.submissions}/{test.totalStudents} submitted
                        </span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(test.submissions / test.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Progress</h3>
                <div className="space-y-4">
                  {studentProgress.map((student, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{student.course} • {student.language}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{student.progress}%</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{student.lastActive}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Test Management</h3>
              <motion.button 
                onClick={() => setShowTestCreator(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Create New Test
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(test.language)}`}>
                        {test.language}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{test.dueDate}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {test.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{test.course}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Submissions</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {test.submissions}/{test.totalStudents}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(test.submissions / test.totalStudents) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-1">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => deleteTest(test.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PDF Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <PDFUpload />
          </motion.div>
        )}

        {/* Other tab contents would be implemented similarly */}
        {activeTab !== 'overview' && activeTab !== 'tests' && activeTab !== 'upload' && (
          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This section is under development. More features coming soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;