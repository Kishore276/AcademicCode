import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Trophy, Users, TrendingUp, BookOpen, Award, Target, Map, GraduationCap, Zap, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  // Add error boundary and debugging
  useEffect(() => {
    console.log('HomePage mounted');
    console.log('Auth state:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const features = [
    {
      icon: BookOpen,
      title: 'Extensive Problem Library',
      description: 'Access thousands of coding problems across different domains and difficulty levels.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Map,
      title: 'Structured Learning Paths',
      description: 'Follow curated learning journeys designed by experts to master specific topics.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Competitive Contests',
      description: 'Participate in weekly contests and compete with developers worldwide.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: GraduationCap,
      title: 'Academic Integration',
      description: 'Faculty can create assessments and track student progress seamlessly.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Monitor your coding journey with detailed analytics and insights.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Award,
      title: 'Achievements & Badges',
      description: 'Earn certificates and showcase your skills to potential employers.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { value: '2K+', label: 'Problems', icon: Code, color: 'from-purple-500 to-pink-500' },
    { value: '100+', label: 'Contests', icon: Trophy, color: 'from-orange-500 to-red-500' },
    { value: '15+', label: 'Languages', icon: Zap, color: 'from-green-500 to-emerald-500' }
  ];

  const learningPaths = [
    {
      title: 'Data Structures Fundamentals',
      description: 'Master arrays, linked lists, stacks, and queues',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      problems: 45,
      duration: '4 weeks'
    },
    {
      title: 'Algorithm Design Patterns',
      description: 'Learn common algorithmic patterns and techniques',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      problems: 72,
      duration: '6 weeks'
    },
    {
      title: 'Dynamic Programming',
      description: 'Conquer the most challenging programming topic',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      problems: 89,
      duration: '8 weeks'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 dark:from-gray-800 dark:via-blue-900 dark:to-purple-900 opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Master Programming
              <span className="block bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent animate-gradient">
                Through Practice & Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Join thousands of students and professionals enhancing their coding skills through structured learning paths, 
              challenging problems, and comprehensive assessments.
            </p>
            
            {isAuthenticated && user ? (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link
                  to={user.role === 'student' ? '/learning-paths' : user.role === 'teacher' ? '/teacher' : '/admin'}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <span>
                    {user.role === 'student' ? 'Continue Learning' : 
                     user.role === 'teacher' ? 'Teacher Dashboard' : 'Admin Dashboard'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Welcome back, {user.username}!</p>
                  <p className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-medium">
                    {user.role === 'student' ? `${user.problemsSolved} problems solved` : `${user.role} account`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/problems"
                  className="border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Browse Problems
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <Link to="/practice" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl py-8 px-4 font-bold text-lg shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex flex-col items-center space-y-2">
              <Zap className="h-8 w-8 mb-2" />
              Practice Arena
            </Link>
            <Link to="/contests" className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl py-8 px-4 font-bold text-lg shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex flex-col items-center space-y-2">
              <Trophy className="h-8 w-8 mb-2" />
              Contests
            </Link>
            <Link to="/assessments" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-8 px-4 font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex flex-col items-center space-y-2">
              <GraduationCap className="h-8 w-8 mb-2" />
              Assessments
            </Link>
            <Link to="/leaderboard" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl py-8 px-4 font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex flex-col items-center space-y-2">
              <TrendingUp className="h-8 w-8 mb-2" />
              Leaderboard
            </Link>
            <Link to="/learning-paths" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl py-8 px-4 font-bold text-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex flex-col items-center space-y-2">
              <Map className="h-8 w-8 mb-2" />
              Learning Paths
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths Preview */}
      <section className="py-20 bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-800 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Learning Paths
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start your coding journey with our carefully curated learning paths designed by industry experts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {path.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {path.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span>{path.problems} problems</span>
                    <span>{path.duration}</span>
                  </div>
                  <Link
                    to="/learning-paths"
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;