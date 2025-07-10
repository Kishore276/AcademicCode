import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Mail, Lock, Eye, EyeOff, GraduationCap, Users, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student'>('student');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    department: '',
    year: '',
    enrollmentId: '',
    teacherId: ''
  });
  
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData.username, formData.password, selectedRole);
      } else {
        const additionalInfo = selectedRole === 'student' 
          ? { department: formData.department, year: parseInt(formData.year), enrollmentId: formData.enrollmentId }
          : { department: formData.department, teacherId: formData.teacherId };
        
        await register(formData.username, formData.email, formData.password, selectedRole, additionalInfo);
      }
      // Redirect based on role
      if (selectedRole === 'admin') {
        navigate('/admin');
      } else if (selectedRole === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/practice');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const roles = [
    { 
      value: 'student', 
      label: 'Student', 
      icon: GraduationCap, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Access learning paths, solve problems, and take assessments',
      credentials: 'Username: student, Password: password'
    },
    { 
      value: 'teacher', 
      label: 'Teacher', 
      icon: Users, 
      color: 'from-purple-500 to-indigo-500',
      description: 'Create tests, manage students, and track progress',
      credentials: 'Username: teacher, Password: password'
    },
    { 
      value: 'admin', 
      label: 'Admin', 
      icon: Shield, 
      color: 'from-red-500 to-pink-500',
      description: 'Full system access and user management',
      credentials: 'Username: admin, Password: password'
    }
  ];

  const quickLogin = (role: 'admin' | 'teacher' | 'student') => {
    setSelectedRole(role);
    setFormData({
      ...formData,
      username: role,
      password: 'password'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-1/2 w-72 h-72 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
              <Code className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome back' : 'Join Academic Code'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Sign in to continue your coding journey' 
              : 'Create your account and start learning'
            }
          </p>
        </motion.div>

        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg py-8 px-6 shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Demo Credentials */}
          {isLogin && (
            <motion.div 
              className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Login (Demo)</h3>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => quickLogin(role.value as any)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-xs font-medium text-gray-900 dark:text-white">{role.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{role.credentials}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <motion.button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedRole === role.value
                        ? `border-transparent bg-gradient-to-r ${role.color} text-white shadow-lg transform scale-105`
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: selectedRole === role.value ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${selectedRole === role.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                      <div>
                        <div className={`font-medium ${selectedRole === role.value ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {role.label}
                        </div>
                        <div className={`text-sm ${selectedRole === role.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your username"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {!isLogin && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required={!isLogin}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required={!isLogin}
                    value={formData.department}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </select>
                </motion.div>

                {selectedRole === 'student' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Year of Study
                      </label>
                      <select
                        id="year"
                        name="year"
                        required={!isLogin && selectedRole === 'student'}
                        value={formData.year}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label htmlFor="enrollmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Enrollment ID
                      </label>
                      <input
                        id="enrollmentId"
                        name="enrollmentId"
                        type="text"
                        required={!isLogin && selectedRole === 'student'}
                        value={formData.enrollmentId}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your enrollment ID"
                      />
                    </motion.div>
                  </>
                )}

                {selectedRole === 'teacher' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teacher ID
                    </label>
                    <input
                      id="teacherId"
                      name="teacherId"
                      type="text"
                      required={!isLogin && selectedRole === 'teacher'}
                      value={formData.teacherId}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your teacher ID"
                    />
                  </motion.div>
                )}
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.4 : 0.8 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </motion.div>

            {isLogin && (
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.6 : 0.9 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </motion.button>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: isLogin ? 0.7 : 1.0 }}
            >
              <span className="text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div 
          className="text-center text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          By continuing, you agree to our{' '}
          <Link to="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
            Privacy Policy
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;