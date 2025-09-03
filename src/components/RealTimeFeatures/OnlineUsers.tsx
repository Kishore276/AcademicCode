import React from 'react';
import { motion } from 'framer-motion';
import { Users, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';

const OnlineUsers = () => {
  const { onlineUsers } = useStore();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'teacher': return 'from-purple-500 to-indigo-500';
      case 'student': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Online Users ({onlineUsers.length})
        </h3>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No users online
          </p>
        ) : (
          onlineUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="relative">
                <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Circle className="h-3 w-3 text-green-500 fill-current" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
              
              <div className="text-xs text-gray-400">
                {user.rating && (
                  <span className="font-medium">{user.rating}</span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;