import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, AlertTriangle, Clock, Monitor, Camera, Shield, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { socketService } from '../../services/socketService';

interface StudentSession {
  id: string;
  name: string;
  status: 'active' | 'suspicious' | 'violation' | 'disconnected';
  progress: number;
  timeRemaining: number;
  violations: number;
  lastActivity: string;
  webcamActive: boolean;
  screenShareActive: boolean;
  currentProblem: number;
  submissionCount: number;
}

const LiveMonitoring = () => {
  const [students, setStudents] = useState<StudentSession[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      status: 'active',
      progress: 75,
      timeRemaining: 45,
      violations: 0,
      lastActivity: '2 minutes ago',
      webcamActive: true,
      screenShareActive: true,
      currentProblem: 3,
      submissionCount: 5
    },
    {
      id: '2',
      name: 'Bob Smith',
      status: 'suspicious',
      progress: 60,
      timeRemaining: 45,
      violations: 2,
      lastActivity: '30 seconds ago',
      webcamActive: true,
      screenShareActive: false,
      currentProblem: 2,
      submissionCount: 3
    },
    {
      id: '3',
      name: 'Carol Davis',
      status: 'violation',
      progress: 40,
      timeRemaining: 45,
      violations: 5,
      lastActivity: '5 minutes ago',
      webcamActive: false,
      screenShareActive: true,
      currentProblem: 2,
      submissionCount: 2
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const { onlineUsers, activityFeed } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'suspicious': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'violation': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'disconnected': return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4" />;
      case 'violation': return <Shield className="h-4 w-4" />;
      case 'disconnected': return <Monitor className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredStudents = students.filter(student => 
    filterStatus === 'all' || student.status === filterStatus
  );

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    suspicious: students.filter(s => s.status === 'suspicious').length,
    violations: students.filter(s => s.status === 'violation').length,
    avgProgress: Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
  };

  useEffect(() => {
    // Listen for real-time activity updates
    socketService.socket?.on('activity_feed_update', (feed) => {
      useStore.setState({ activityFeed: feed });
    });
    return () => {
      socketService.socket?.off('activity_feed_update');
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Suspicious</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.suspicious}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Violations</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.violations}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
        {['all', 'active', 'suspicious', 'violation', 'disconnected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Online Users Panel */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Users className="h-5 w-5" /> Online Users</h3>
        <div className="flex flex-wrap gap-2">
          {onlineUsers.map((user) => (
            <span key={user.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
              {user.username} <span className="text-gray-400">({user.role})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Who is Solving What */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Eye className="h-5 w-5" /> Who is Solving What</h3>
        <div className="space-y-2">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
              <span className="text-xs text-gray-500">is solving</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">{user.currentProblemTitle || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Activity Feed */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Activity className="h-5 w-5" /> Real-Time Activity Feed</h3>
        <div className="space-y-2">
          {activityFeed && activityFeed.length > 0 ? (
            activityFeed.map((event: any, idx: number) => (
              <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-primary-600 dark:text-primary-400">{event.user}</span> {event.action} <span className="font-semibold">{event.target}</span> <span className="text-xs text-gray-400">{new Date(event.time).toLocaleTimeString()}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No recent activity.</div>
          )}
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedStudent === student.id 
                ? 'border-primary-500 shadow-lg' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => setSelectedStudent(student.id)}
          >
            {/* Student Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{student.lastActivity}</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {getStatusIcon(student.status)}
                <span>{student.status}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{student.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{student.currentProblem}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Current Problem</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{student.submissionCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Submissions</div>
              </div>
            </div>

            {/* Monitoring Status */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${student.webcamActive ? 'text-green-500' : 'text-red-500'}`}>
                  <Camera className="h-3 w-3" />
                  <span>Webcam</span>
                </div>
                <div className={`flex items-center space-x-1 ${student.screenShareActive ? 'text-green-500' : 'text-red-500'}`}>
                  <Monitor className="h-3 w-3" />
                  <span>Screen</span>
                </div>
              </div>
              
              {student.violations > 0 && (
                <div className="flex items-center space-x-1 text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{student.violations} violations</span>
                </div>
              )}
            </div>

            {/* Time Remaining */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Time Remaining</span>
                <span className="font-medium text-gray-900 dark:text-white">{student.timeRemaining} min</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Student Monitoring - {students.find(s => s.id === selectedStudent)?.name}
                </h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Webcam Feed */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Live Webcam Feed</p>
                    <p className="text-sm text-gray-400">Simulated for demo</p>
                  </div>
                </div>

                {/* Screen Share Feed */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Screen Share Feed</p>
                    <p className="text-sm text-gray-400">Simulated for demo</p>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Timeline</h4>
                <div className="space-y-3">
                  {[
                    { time: '14:30', action: 'Started Problem 3', type: 'normal' },
                    { time: '14:25', action: 'Submitted solution for Problem 2', type: 'success' },
                    { time: '14:20', action: 'Tab switch detected', type: 'warning' },
                    { time: '14:15', action: 'Started Problem 2', type: 'normal' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                      <span className="text-sm text-gray-900 dark:text-white">{activity.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LiveMonitoring;