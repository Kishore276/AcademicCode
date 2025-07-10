import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Trophy, TrendingUp, UserCheck, UserX, Settings, BarChart3, PieChart, Activity } from 'lucide-react';
import { userService, problemService, contestService } from '../services/dataService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [problems, setProblems] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAll() {
      setProblems(await problemService.getProblems());
      setContests(await contestService.getContests());
      setUsers(await userService.getUsers());
    }
    fetchAll();
  }, []);

  const stats = [
    { label: 'Total Users', value: '15,847', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Students', value: '12,456', change: '+8%', icon: UserCheck, color: 'from-green-500 to-emerald-500' },
    { label: 'Faculty Members', value: '234', change: '+3%', icon: UserX, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Problems', value: '2,847', change: '+15%', icon: BookOpen, color: 'from-orange-500 to-red-500' },
    { label: 'Contests Held', value: '156', change: '+22%', icon: Trophy, color: 'from-indigo-500 to-purple-500' },
    { label: 'Submissions Today', value: '8,934', change: '+18%', icon: TrendingUp, color: 'from-pink-500 to-rose-500' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@university.edu', role: 'student', department: 'Computer Science', joinDate: '2024-01-15', status: 'active' },
    { id: 2, name: 'Dr. Sarah Wilson', email: 'sarah@university.edu', role: 'faculty', department: 'Mathematics', joinDate: '2024-01-14', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@university.edu', role: 'student', department: 'Engineering', joinDate: '2024-01-13', status: 'pending' },
    { id: 4, name: 'Prof. David Lee', email: 'david@university.edu', role: 'faculty', department: 'Computer Science', joinDate: '2024-01-12', status: 'active' }
  ];

  const systemHealth = [
    { metric: 'Server Uptime', value: '99.9%', status: 'excellent' },
    { metric: 'Response Time', value: '120ms', status: 'good' },
    { metric: 'Database Load', value: '45%', status: 'good' },
    { metric: 'Memory Usage', value: '67%', status: 'warning' },
    { metric: 'Disk Space', value: '23%', status: 'excellent' },
    { metric: 'Active Sessions', value: '1,247', status: 'good' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'good': return 'text-primary-600 bg-primary-100 dark:bg-primary-900/30';
      case 'warning': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'error': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'faculty': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'student': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'problems', label: 'Problem Management', icon: BookOpen },
    { id: 'contests', label: 'Contest Management', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'system', label: 'System Health', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage users, monitor system performance, and oversee platform operations
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
                      ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {stat.change}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent User Registrations</h3>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.joinDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-right">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
                <div className="space-y-3">
                  {systemHealth.map((item) => (
                    <div key={item.metric} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
              <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                Add New User (Coming Soon)
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                      <td className="px-4 py-2">{user.isOnline ? 'Online' : 'Offline'}</td>
                      <td className="px-4 py-2">
                        <button className="text-xs text-blue-600 mr-2">Edit</button>
                        <button className="text-xs text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Problem Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Difficulty</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr key={problem.id}>
                      <td className="px-4 py-2">{problem.title}</td>
                      <td className="px-4 py-2">{problem.difficulty}</td>
                      <td className="px-4 py-2">{problem.category}</td>
                      <td className="px-4 py-2">
                        <button className="text-xs text-blue-600 mr-2">Edit</button>
                        <button className="text-xs text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contests' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contest Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Start Date</th>
                    <th className="px-4 py-2">End Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contests.map((contest) => (
                    <tr key={contest.id}>
                      <td className="px-4 py-2">{contest.title}</td>
                      <td className="px-4 py-2">{contest.startDate}</td>
                      <td className="px-4 py-2">{contest.endDate}</td>
                      <td className="px-4 py-2">
                        <button className="text-xs text-blue-600 mr-2">Edit</button>
                        <button className="text-xs text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Real-Time Activity Log</h3>
            <div className="h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300">
              <p>Activity log coming soon. This will show real-time user and system activity.</p>
            </div>
          </div>
        )}

        {/* Other tab contents would be implemented similarly */}
        {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'problems' && activeTab !== 'contests' && activeTab !== 'analytics' && (
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

export default AdminDashboard;