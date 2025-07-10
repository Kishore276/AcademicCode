import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Trash2, ExternalLink, CheckCircle, AlertTriangle, MessageCircle, Trophy } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { socketService } from '../../services/socketService';

const NotificationPanel = () => {
  const { 
    notificationsPanelOpen, 
    setNotificationsPanelOpen, 
    notifications, 
    markNotificationAsRead, 
    addNotification 
  } = useStore();

  useEffect(() => {
    // Listen for real-time notifications
    socketService.on('notification', (notif) => {
      addNotification(notif);
    });
    return () => {
      socketService.off('notification');
    };
  }, [addNotification]);

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'contest': return <Trophy className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-success-500 bg-success-50 dark:bg-success-900/20';
      case 'warning': return 'border-l-warning-500 bg-warning-50 dark:bg-warning-900/20';
      case 'error': return 'border-l-error-500 bg-error-50 dark:bg-error-900/20';
      default: return 'border-l-primary-500 bg-primary-50 dark:bg-primary-900/20';
    }
  };

  return (
    <AnimatePresence>
      {notificationsPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setNotificationsPanelOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setNotificationsPanelOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <Bell className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-l-4 p-4 rounded-lg ${getNotificationColor(notification.type)} ${
                        !notification.read ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getIcon(notification.type)}
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </span>
                            <div className="flex items-center space-x-2">
                              {notification.actionUrl && (
                                <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <span>{notification.actionText || 'View'}</span>
                                </button>
                              )}
                              {!notification.read && (
                                <button
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                                >
                                  <Check className="h-3 w-3" />
                                  <span>Mark as read</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;