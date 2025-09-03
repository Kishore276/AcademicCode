import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, Save, Share2, Users, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { socketService } from '../../services/socketService';
import toast from 'react-hot-toast';

interface LiveCodeEditorProps {
  roomId?: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  height?: string;
  showCollaboration?: boolean;
}

const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({
  roomId,
  language,
  value,
  onChange,
  onRun,
  onSubmit,
  readOnly = false,
  height = '400px',
  showCollaboration = false
}) => {
  const { theme, editorSettings, updateEditorSettings, onlineUsers, currentRoom } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (roomId && showCollaboration) {
      // Join collaboration room
      socketService.joinRoom(roomId);
      
      return () => {
        socketService.leaveRoom(roomId);
      };
    }
  }, [roomId, showCollaboration]);

  const handleCodeChange = (newValue: string | undefined) => {
    const code = newValue || '';
    onChange(code);
    
    // Share code changes in real-time
    if (roomId && showCollaboration && !readOnly) {
      socketService.shareCode(roomId, code, language);
    }
  };

  const handleShareCode = () => {
    if (!roomId) {
      // Create a new collaboration room
      const newRoomId = `code-${Date.now()}`;
      socketService.joinRoom(newRoomId);
      setIsSharing(true);
      toast.success('Code sharing started! Share the room ID with others.');
    } else {
      setIsSharing(!isSharing);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorOptions = {
    minimap: { enabled: editorSettings.minimap },
    fontSize: editorSettings.fontSize,
    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: editorSettings.wordWrap ? 'on' : 'off',
    readOnly,
    theme: theme === 'dark' ? 'vs-dark' : 'light',
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: true,
    smoothScrolling: true,
    multiCursorModifier: 'ctrlCmd',
    formatOnPaste: true,
    formatOnType: true,
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => onChange(value)}
            className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
          
          {showCollaboration && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {collaborators.length} collaborators
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showCollaboration && (
            <button
              onClick={handleShareCode}
              className={`p-2 rounded-lg transition-colors ${
                isSharing 
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
              title="Share code"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => {/* Open settings modal */}}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Editor settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Collaborators Bar */}
      {showCollaboration && collaborators.length > 0 && (
        <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <span className="text-sm text-blue-700 dark:text-blue-300">Active collaborators:</span>
          {collaborators.map((collaborator, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {collaborator.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {collaborator.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <div style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleCodeChange}
          options={editorOptions}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          }
        />
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            {onRun && (
              <motion.button
                onClick={onRun}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-4 w-4" />
                <span>Run Code</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={() => {/* Save code */}}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </motion.button>
            
            {onSubmit && (
              <motion.button
                onClick={onSubmit}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Submit Solution</span>
              </motion.button>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>Ctrl+S to save • Ctrl+/ to comment • Ctrl+Enter to run</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCodeEditor;