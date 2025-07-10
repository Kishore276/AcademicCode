import React, { useState } from 'react';
import { Users, ClipboardList, BookOpen, BarChart3, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'My Students', value: '156', change: '+8', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Assessments', value: '12', change: '+3', icon: ClipboardList, color: 'from-green-500 to-emerald-500' },
    { label: 'Problems Created', value: '47', change: '+5', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Avg. Score', value: '78%', change: '+2%', icon: BarChart3, color: 'from-orange-500 to-red-500' }
  ];

  const recentAssessments = [
    {
      id: 1,
      title: 'Data Structures Midterm',
      course: 'CS 201',
      dueDate: '2024-01-25',
      submissions: 45,
      totalStudents: 50,
      status: 'active'
    },
    {
      id: 2,
      title: 'Algorithm Analysis Quiz',
      course: 'CS 301',
      dueDate: '2024-01-20',
      submissions: 32,
      totalStudents: 35,
      status: 'grading'
    },
    {
      id: 3,
      title: 'Programming Fundamentals',
      course: 'CS 101',
      dueDate: '2024-01-15',
      submissions: 28,
      totalStudents: 30,
      status: 'completed'
    }
  ];

  const studentProgress = [
    { name: 'Alice Johnson', course: 'CS 201', progress: 85, lastActive: '2 hours ago', status: 'excellent' },
    { name: 'Bob Smith', course: 'CS 301', progress: 72, lastActive: '1 day ago', status: 'good' },
    { name: 'Carol Davis', course: 'CS 101', progress: 45, lastActive: '3 days ago', status: 'needs-attention' },
    { name: 'David Wilson', course: 'CS 201', progress: 91, lastActive: '1 hour ago', status: 'excellent' }
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'problems', label: 'Problem Bank', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Faculty Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your courses, create assessments, and track student progress
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Assessments</h3>
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                    <Plus className="h-4 w-4 inline mr-1" />
                    New Assessment
                  </button>
                </div>
                <div className="space-y-4">
                  {recentAssessments.map((assessment) => (
                    <div key={assessment.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{assessment.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {assessment.course} • Due: {assessment.dueDate}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {assessment.submissions}/{assessment.totalStudents} submitted
                        </span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                            style={{ width: `${(assessment.submissions / assessment.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-right">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Progress</h3>
                <div className="space-y-4">
                  {studentProgress.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{student.course}</div>
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Assessment Management</h3>
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Plus className="h-5 w-5 inline mr-2" />
                Create New Assessment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAssessments.map((assessment, index) => (
                <div
                  key={assessment.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{assessment.dueDate}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {assessment.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{assessment.course}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Submissions</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {assessment.submissions}/{assessment.totalStudents}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(assessment.submissions / assessment.totalStudents) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300">
                        Grade
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tab contents would be implemented similarly */}
        {activeTab !== 'overview' && activeTab !== 'assessments' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This section is under development. More features coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;