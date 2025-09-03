import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, BookOpen, Trophy, Calendar, Filter } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('submissions');

  // Mock data - in real app, this would come from API
  const submissionData = [
    { date: '2024-01-01', submissions: 45, accepted: 32, users: 28 },
    { date: '2024-01-02', submissions: 52, accepted: 38, users: 31 },
    { date: '2024-01-03', submissions: 48, accepted: 35, users: 29 },
    { date: '2024-01-04', submissions: 61, accepted: 44, users: 35 },
    { date: '2024-01-05', submissions: 55, accepted: 41, users: 33 },
    { date: '2024-01-06', submissions: 67, accepted: 49, users: 38 },
    { date: '2024-01-07', submissions: 73, accepted: 54, users: 42 },
  ];

  const languageData = [
    { name: 'Python', value: 35, color: '#3B82F6' },
    { name: 'JavaScript', value: 25, color: '#F59E0B' },
    { name: 'Java', value: 20, color: '#EF4444' },
    { name: 'C++', value: 15, color: '#8B5CF6' },
    { name: 'Others', value: 5, color: '#6B7280' },
  ];

  const difficultyData = [
    { difficulty: 'Easy', solved: 156, total: 200 },
    { difficulty: 'Medium', solved: 89, total: 150 },
    { difficulty: 'Hard', solved: 34, total: 100 },
  ];

  const performanceData = [
    { week: 'Week 1', rating: 1200, problems: 5 },
    { week: 'Week 2', rating: 1250, problems: 8 },
    { week: 'Week 3', rating: 1320, problems: 12 },
    { week: 'Week 4', rating: 1380, problems: 15 },
    { week: 'Week 5', rating: 1450, problems: 18 },
    { week: 'Week 6', rating: 1520, problems: 22 },
  ];

  const stats = [
    { 
      label: 'Total Submissions', 
      value: '2,847', 
      change: '+12%', 
      icon: TrendingUp, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Active Users', 
      value: '1,234', 
      change: '+8%', 
      icon: Users, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      label: 'Problems Solved', 
      value: '1,567', 
      change: '+15%', 
      icon: BookOpen, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      label: 'Contests Held', 
      value: '23', 
      change: '+4%', 
      icon: Trophy, 
      color: 'from-orange-500 to-red-500' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track performance and engagement metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-success-600 dark:text-success-400">
                  {stat.change}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions Over Time */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Submissions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={submissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="submissions" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
              />
              <Area 
                type="monotone" 
                dataKey="accepted" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Language Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Language Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty Progress */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Problems by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="solved" fill="#10B981" name="Solved" />
              <Bar dataKey="total" fill="#E5E7EB" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Trend */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="rating" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Rating"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="problems" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Problems Solved"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Metrics Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Metrics
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Accepted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acceptance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {submissionData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.submissions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.accepted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {((row.accepted / row.submissions) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.users}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;