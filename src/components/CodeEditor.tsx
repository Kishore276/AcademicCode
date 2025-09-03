import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Download, Upload, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  onRun,
  onSubmit,
  readOnly = false,
  height = '400px'
}) => {
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code saved!');
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.java,.cpp,.c';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
          toast.success('File uploaded!');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on' as const,
    readOnly,
    theme: theme === 'dark' ? 'vs-dark' : 'light'
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
          </select>
          
          <div className="flex items-center space-x-1">
            <label className="text-sm text-gray-600 dark:text-gray-400">Font Size:</label>
            <input
              type="range"
              min="12"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}px</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleUpload}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Upload file"
          >
            <Upload className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleSave}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Save file"
          >
            <Save className="h-4 w-4" />
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

      {/* Editor */}
      <div style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={editorOptions}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
        />
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            {onRun && (
              <button
                onClick={onRun}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Run Code</span>
              </button>
            )}
            
            {onSubmit && (
              <button
                onClick={onSubmit}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>Submit Solution</span>
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Press Ctrl+S to save • Ctrl+/ to comment
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;