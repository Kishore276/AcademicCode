import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Trophy, ArrowRight, Medal } from 'lucide-react';
import { contestService } from '../services/dataService';
import { motion } from 'framer-motion';
import { socketService } from '../services/socketService';
import { useAuth } from '../contexts/AuthContext';

const ContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContest, setActiveContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchContests() {
      const allContests = await contestService.getContests();
      setContests(allContests);
    }
    fetchContests();
    // Listen for real-time leaderboard updates
    socketService.socket?.on('contest_leaderboard_update', (data) => {
      setLeaderboard(data.leaderboard);
    });
    return () => {
      socketService.socket?.off('contest_leaderboard_update');
    };
  }, []);

  const loadContests = () => {
    setLoading(true);
    try {
      const allContests = contestService.getContests();
      setContests(allContests);
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinContest = (contestId) => {
    socketService.joinRoom(contestId);
    setActiveContest(contests.find(c => c.id === contestId));
  };

  const handleCreateContest = (contestData) => {
    // Only for admin/teacher
    if (user.role === 'admin' || user.role === 'teacher') {
      contestService.createContest(contestData);
      loadContests();
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Programming Contests
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test your skills against developers worldwide in our competitive programming challenges
          </p>
        </motion.div>

        {/* No Contests Message */}
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="p-6 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
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
            <Trophy className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Active Contests
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            There are currently no contests scheduled. Check back later for exciting programming challenges!
          </p>
          
          {/* Contest Tips */}
          <motion.div 
            className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contest Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <h5 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">Before the Contest</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Read all problems before starting</li>
                  <li>• Plan your time allocation</li>
                  <li>• Test your coding environment</li>
                  <li>• Review common algorithms</li>
                </ul>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <h5 className="font-semibold mb-2 text-secondary-600 dark:text-secondary-400">During the Contest</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Start with easier problems</li>
                  <li>• Write clean, readable code</li>
                  <li>• Test with edge cases</li>
                  <li>• Manage your time wisely</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Active Contests List */}
        {contests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Active Contests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contests.map((contest) => (
                <div key={contest.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col items-center">
                  <h3 className="text-lg font-bold mb-2">{contest.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{contest.description}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm text-gray-500"><Calendar className="inline h-4 w-4 mr-1" />{new Date(contest.startTime).toLocaleString()}</span>
                    <span className="text-sm text-gray-500"><Clock className="inline h-4 w-4 mr-1" />{contest.duration} min</span>
                  </div>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold shadow hover:bg-primary-600 transition" onClick={() => handleJoinContest(contest.id)}>Join Contest</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Leaderboard */}
        {activeContest && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Live Leaderboard</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((entry, idx) => (
                    <tr key={entry.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ContestsPage;