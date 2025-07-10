import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Menu, X, Sun, Moon, User, LogOut, Trophy, BookOpen, Users, Map, GraduationCap, ClipboardList, Settings, Shield, Bell, MessageSquare, Zap, BarChart3 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../store/useStore';
import NotificationPanel from '../RealTimeFeatures/NotificationPanel';
import ChatPanel from '../RealTimeFeatures/ChatPanel';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    notifications, 
    setNotificationsPanelOpen, 
    setChatPanelOpen,
    notificationsPanelOpen,
    chatPanelOpen 
  } = useStore();
  const location = useLocation();

  const getNavItems = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      // Admin: Only show admin dashboard and management features
      return [
        { name: 'Admin Dashboard', href: '/admin', icon: Shield },
        { name: 'User Management', href: '/admin?tab=users', icon: Users },
        { name: 'Problem Management', href: '/admin?tab=problems', icon: BookOpen },
        { name: 'Contest Management', href: '/admin?tab=contests', icon: Trophy },
        { name: 'Analytics', href: '/admin?tab=analytics', icon: BarChart3 },
      ];
    }
    if (user.role === 'teacher') {
      // Teacher: Only show dashboard, assessments, and learning paths
      return [
        { name: 'Teacher Dashboard', href: '/teacher', icon: GraduationCap },
        { name: 'Assessments', href: '/assessments', icon: ClipboardList },
        { name: 'Learning Paths', href: '/learning-paths', icon: Map },
      ];
    }
    // Student: Show all main features
    const baseItems = [
      { name: 'Practice Arena', href: '/practice', icon: Zap },
      { name: 'Problems', href: '/problems', icon: BookOpen },
      { name: 'Contests', href: '/contests', icon: Trophy },
      { name: 'Learning Paths', href: '/learning-paths', icon: Map },
      { name: 'Leaderboard', href: '/leaderboard', icon: Users },
      { name: 'Assessments', href: '/assessments', icon: ClipboardList },
    ];
    return baseItems;
  };

  const navItems = getNavItems();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const isActive = (path: string) => location.pathname === path;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'teacher': return 'from-purple-500 to-indigo-500';
      case 'student': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return GraduationCap;
      case 'student': return User;
      default: return User;
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl group-hover:from-primary-600 group-hover:to-secondary-600 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Academic Code
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={item.name}
                    tabIndex={0}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Real-time features for authenticated users */}
              {isAuthenticated && (
                <>
                  {/* Notifications */}
                  <button
                    onClick={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
                    className="relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-300 transform hover:scale-105"
                    aria-label="Open notifications"
                    tabIndex={0}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* Chat */}
                  <button
                    onClick={() => setChatPanelOpen(!chatPanelOpen)}
                    className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-300 transform hover:scale-105"
                    aria-label="Open chat panel"
                    tabIndex={0}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-300 transform hover:scale-105"
                aria-label="Toggle theme"
                tabIndex={0}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* User menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-300 transform hover:scale-105"
                    aria-label="User menu"
                    tabIndex={0}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-sm font-bold">
                        {user?.username?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-slide-down" role="menu" aria-label="User menu">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-200"
                          onClick={() => setIsProfileMenuOpen(false)}
                          role="menuitem"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      
                      {user.role === 'teacher' && (
                        <Link
                          to="/teacher"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-200"
                          onClick={() => setIsProfileMenuOpen(false)}
                          role="menuitem"
                        >
                          <GraduationCap className="h-4 w-4" />
                          <span>Teacher Dashboard</span>
                        </Link>
                      )}
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-slide-down">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      aria-label={item.name}
                      tabIndex={0}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Real-time Panels */}
      <NotificationPanel />
      <ChatPanel />
    </>
  );
};

export default Navbar;