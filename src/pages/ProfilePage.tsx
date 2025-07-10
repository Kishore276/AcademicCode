import React, { useEffect, useState } from 'react';
import { User, Award, TrendingUp, Calendar, Target, BookOpen, Trophy, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/dataService';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [mySubs, setMySubs] = useState<any[]>([]);
  const [contests, setContests] = useState([]);
  const [contestsJoined, setContestsJoined] = React.useState<number>(0);
  const [solvedProblems, setSolvedProblems] = React.useState<number>(0);
  const [achievements, setAchievements] = React.useState<any[]>([]);

  // Gamification mock data
  const dailyStreak = 5; // days
  const xp = 320;
  const xpGoal = 500;
  const dailyChallenge = { title: 'Solve 2 problems', completed: true };
  const weeklyChallenge = { title: 'Participate in a contest', completed: false };

  useEffect(() => {
    async function fetchSubs() {
      const allSubs = await userService.getSubmissions();
      setMySubs(allSubs.filter((s: any) => s.userId === user?.id));
    }
    if (user?.id) fetchSubs();
  }, [user?.id]);

  useEffect(() => {
    async function fetchContests() {
      const allContests = await userService.getContests();
      setContests(allContests);
    }
    fetchContests();
  }, []);

  useEffect(() => {
    // Fetch solved problems
    const solved = new Set(mySubs.filter((s: any) => s.verdict === 'Accepted').map((s: any) => s.problemId));
    setSolvedProblems(solved.size);
    // Fetch contests joined
    const joined = contests.filter((c: any) => c.participants && c.participants.includes(user?.id));
    setContestsJoined(joined.length);
    // Achievements
    setAchievements([
      { title: 'First Solve', description: 'Solved your first problem', icon: Target, unlocked: solved.size > 0 },
      { title: 'Problem Solver', description: 'Solved 100 problems', icon: BookOpen, unlocked: solved.size >= 100 },
      { title: 'Contest Participant', description: 'Participated in 10 contests', icon: Trophy, unlocked: joined.length >= 10 },
      { title: 'Rising Star', description: 'Reached Expert rank', icon: Star, unlocked: user?.rank === 'Expert' }
    ]);
  }, [mySubs, user, contests]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Problems Solved', value: solvedProblems, icon: Target, color: 'text-success-600' },
    { label: 'Current Rating', value: user.rating, icon: TrendingUp, color: 'text-primary-600' },
    { label: 'Contests Joined', value: contestsJoined, icon: Trophy, color: 'text-warning-600' },
    { label: 'Rank', value: user.rank, icon: Award, color: 'text-purple-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'Wrong Answer': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      case 'Time Limit Exceeded': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600';
      case 'Medium': return 'text-warning-600';
      case 'Hard': return 'text-error-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                  {user.rank}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </span>
                <Link to={`/profile/${user.id}`} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium hover:underline">Public Profile</Link>
              </div>
            </div>

            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Gamification Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">🔥 {dailyStreak}-day streak</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Keep it up!</span>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">XP</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{xp}/{xpGoal}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${(xp / xpGoal) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-medium ${dailyChallenge.completed ? 'text-green-600' : 'text-gray-500'}`}>Daily: {dailyChallenge.title} {dailyChallenge.completed && '✓'}</span>
            <span className={`text-xs font-medium ${weeklyChallenge.completed ? 'text-green-600' : 'text-gray-500'}`}>Weekly: {weeklyChallenge.title} {weeklyChallenge.completed && '✓'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Submissions</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mySubs.length === 0 ? (
                  <div className="text-gray-500">No submissions yet.</div>
                ) : mySubs.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {submission.problemId}
                        </h4>
                        <span className={`text-xs font-medium ${getDifficultyColor(submission.difficulty)}`}>
                          {submission.language}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.verdict)}`}>
                          {submission.verdict}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg ${achievement.unlocked ? 'bg-success-50 dark:bg-success-900/20' : 'bg-gray-50 dark:bg-gray-700 opacity-60'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-success-100 dark:bg-success-900/30' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        <Icon className={`h-5 w-5 ${achievement.unlocked ? 'text-success-600 dark:text-success-400' : 'text-gray-400'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      
                      {achievement.unlocked && (
                        <div className="text-success-600 dark:text-success-400">
                          <Award className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contest History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contest History</h3>
          <div className="space-y-2">
            {contestsJoined === 0 ? (
              <div className="text-gray-500">No contests joined yet.</div>
            ) : (
              contests.filter((c: any) => c.participants && c.participants.includes(user.id)).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{c.title}</span>
                    <span className="ml-2 text-xs text-gray-500">{new Date(c.startTime).toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-primary-600 dark:text-primary-400">{c.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Overview
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Activity heatmap coming soon...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;