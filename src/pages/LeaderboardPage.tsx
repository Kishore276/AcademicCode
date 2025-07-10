import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, User, Calendar } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  username: string;
  rating: number;
  problemsSolved: number;
  contestsParticipated: number;
  country: string;
  avatar?: string;
  tier: 'Newbie' | 'Pupil' | 'Specialist' | 'Expert' | 'Candidate Master' | 'Master' | 'Grandmaster';
}

const LeaderboardPage = () => {
  const [timeframe, setTimeframe] = useState('all-time');
  const [category, setCategory] = useState('overall');

  const users: LeaderboardUser[] = [
    {
      rank: 1,
      username: 'CodeMaster2024',
      rating: 2847,
      problemsSolved: 1247,
      contestsParticipated: 89,
      country: 'USA',
      tier: 'Grandmaster'
    },
    {
      rank: 2,
      username: 'AlgoWizard',
      rating: 2756,
      problemsSolved: 1156,
      contestsParticipated: 76,
      country: 'China',
      tier: 'Master'
    },
    {
      rank: 3,
      username: 'ByteNinja',
      rating: 2698,
      problemsSolved: 1089,
      contestsParticipated: 82,
      country: 'India',
      tier: 'Master'
    },
    {
      rank: 4,
      username: 'DataStructGuru',
      rating: 2567,
      problemsSolved: 987,
      contestsParticipated: 65,
      country: 'Russia',
      tier: 'Candidate Master'
    },
    {
      rank: 5,
      username: 'RecursionKing',
      rating: 2489,
      problemsSolved: 934,
      contestsParticipated: 71,
      country: 'Japan',
      tier: 'Candidate Master'
    },
    {
      rank: 6,
      username: 'DynamicCoder',
      rating: 2387,
      problemsSolved: 856,
      contestsParticipated: 58,
      country: 'Germany',
      tier: 'Expert'
    },
    {
      rank: 7,
      username: 'GraphTraverser',
      rating: 2298,
      problemsSolved: 789,
      contestsParticipated: 63,
      country: 'Canada',
      tier: 'Expert'
    },
    {
      rank: 8,
      username: 'TreeBuilder',
      rating: 2245,
      problemsSolved: 743,
      contestsParticipated: 55,
      country: 'UK',
      tier: 'Expert'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Newbie': return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      case 'Pupil': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Specialist': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'Expert': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'Candidate Master': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'Master': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'Grandmaster': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Global Leaderboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            See how you stack up against the world's best competitive programmers
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all-time">All Time</option>
                  <option value="this-year">This Year</option>
                  <option value="this-month">This Month</option>
                  <option value="this-week">This Week</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="overall">Overall Rating</option>
                  <option value="problems">Problems Solved</option>
                  <option value="contests">Contest Participation</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Updated every hour
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {users.slice(0, 3).map((user, index) => (
              <div
                key={user.username}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center transform ${
                  index === 0 ? 'md:scale-105 md:-translate-y-4' : ''
                }`}
              >
                <div className="flex justify-center mb-4">
                  {getRankIcon(user.rank)}
                </div>
                
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {user.username}
                </h3>
                
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${getTierColor(user.tier)}`}>
                  {user.tier}
                </span>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {user.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Problems:</span>
                    <span className="font-semibold">{user.problemsSolved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contests:</span>
                    <span className="font-semibold">{user.contestsParticipated}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Rankings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Problems Solved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Country
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.username} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.username || "?"}
                          </div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTierColor(user.tier)}`}>
                            {user.tier}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {user.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {user.problemsSolved}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.contestsParticipated}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.country}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;