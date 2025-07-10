import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Code, Users, Smile } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDistanceToNow } from 'date-fns';

const ChatPanel = () => {
  const { 
    chatPanelOpen, 
    setChatPanelOpen, 
    chatMessages, 
    addChatMessage, 
    currentRoom,
    user,
    onlineUsers
  } = useStore();

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    addChatMessage({
      senderId: user.id,
      senderName: user.username,
      message: message.trim(),
      type: 'text',
      read: false,
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageColor = (senderId: string) => {
    return senderId === user?.id 
      ? 'bg-primary-500 text-white ml-auto' 
      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white';
  };

  return (
    <AnimatePresence>
      {chatPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setChatPanelOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col lg:relative lg:w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {currentRoom?.name || 'Global Chat'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {onlineUsers.length} online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatPanelOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Online Users */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 overflow-x-auto">
                {onlineUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex-shrink-0 flex items-center space-x-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {user.username}
                    </span>
                  </div>
                ))}
                {onlineUsers.length > 5 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{onlineUsers.length - 5} more
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <Users className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${getMessageColor(msg.senderId)}`}>
                      {msg.senderId !== user?.id && (
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {isTyping && (
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                Someone is typing...
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={1}
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-1">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Smile className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Code className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;