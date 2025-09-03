import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, Square, Save, Download, Upload, Settings, Terminal, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { compilerService } from '../../services/compilerService';
import toast from 'react-hot-toast';

interface CompilerProps {
  language: string;
  onLanguageChange: (language: string) => void;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  showOutput?: boolean;
  testCases?: any[];
  onSubmit?: (results: any) => void;
}

const RealTimeCompiler: React.FC<CompilerProps> = ({
  language,
  onLanguageChange,
  initialCode = '',
  onCodeChange,
  readOnly = false,
  showOutput = true,
  testCases = [],
  onSubmit
}) => {
  const { theme, editorSettings } = useStore();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const editorRef = useRef<any>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'c', label: 'C', extension: 'c' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'go', label: 'Go', extension: 'go' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
    { value: 'php', label: 'PHP', extension: 'php' },
    { value: 'ruby', label: 'Ruby', extension: 'rb' },
    { value: 'kotlin', label: 'Kotlin', extension: 'kt' },
    { value: 'swift', label: 'Swift', extension: 'swift' }
  ];

  const getStarterCode = (lang: string) => {
    const templates = {
      javascript: `// JavaScript Code
function main() {
    console.log("Hello, World!");
}

main();`,
      python: `# Python Code
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
      java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      cpp: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      c: `// C Code
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      typescript: `// TypeScript Code
function main(): void {
    console.log("Hello, World!");
}

main();`,
      go: `// Go Code
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
      rust: `// Rust Code
fn main() {
    println!("Hello, World!");
}`,
      php: `<?php
// PHP Code
echo "Hello, World!";
?>`,
      ruby: `# Ruby Code
puts "Hello, World!"`,
      kotlin: `// Kotlin Code
fun main() {
    println("Hello, World!")
}`,
      swift: `// Swift Code
print("Hello, World!")`
    };
    return templates[lang as keyof typeof templates] || '';
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    if (!code || code === getStarterCode(language)) {
      const newCode = getStarterCode(newLanguage);
      setCode(newCode);
      onCodeChange?.(newCode);
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...\n');
    setTestResults([]);

    try {
      const result = await compilerService.executeCode(code, language, input);
      
      setOutput(result.output || 'No output');
      setExecutionTime(result.executionTime);
      setMemoryUsage(result.memoryUsage);
      
      if (result.error) {
        setOutput(prev => prev + '\n\nError:\n' + result.error);
        toast.error('Code execution failed');
      } else {
        toast.success('Code executed successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    if (testCases.length === 0) {
      toast.error('No test cases available');
      return;
    }

    setIsRunning(true);
    setOutput('Running test cases...\n');

    try {
      const results = await compilerService.validateSolution(code, language, testCases);
      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      setOutput(`Test Results: ${passedCount}/${totalCount} passed\n\n` +
        results.map((r, i) => 
          `Test Case ${i + 1}: ${r.passed ? 'PASSED' : 'FAILED'}\n` +
          `Input: ${r.input}\n` +
          `Expected: ${r.expectedOutput}\n` +
          `Got: ${r.actualOutput}\n` +
          (r.error ? `Error: ${r.error}\n` : '') +
          `Time: ${r.executionTime}ms\n`
        ).join('\n')
      );

      if (onSubmit) {
        onSubmit({
          code,
          language,
          results,
          passedCount,
          totalCount,
          score: Math.round((passedCount / totalCount) * 100)
        });
      }

      if (passedCount === totalCount) {
        toast.success('All test cases passed!');
      } else {
        toast.error(`${passedCount}/${totalCount} test cases passed`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Code submission failed');
    } finally {
      setIsRunning(false);
    }
  };

  const stopExecution = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n\nExecution stopped by user.');
  };

  const saveCode = () => {
    const currentLang = languages.find(l => l.value === language);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${currentLang?.extension || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code saved successfully');
  };

  const loadCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.java,.cpp,.c,.ts,.go,.rs,.php,.rb,.kt,.swift,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
          onCodeChange?.(content);
          toast.success('Code loaded successfully');
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    snippetSuggestions: 'top',
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all duration-300"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={isRunning ? stopExecution : runCode}
              disabled={readOnly}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isRunning ? 'Stop' : 'Run'}</span>
            </motion.button>

            {testCases.length > 0 && (
              <motion.button
                onClick={submitCode}
                disabled={readOnly || isRunning}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Submit</span>
              </motion.button>
            )}

            <button
              onClick={() => setIsInputVisible(!isInputVisible)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Toggle input"
            >
              <Terminal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadCode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Load file"
          >
            <Upload className="h-4 w-4" />
          </button>
          
          <button
            onClick={saveCode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Save file"
          >
            <Save className="h-4 w-4" />
          </button>
          
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Input Section */}
      {isInputVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input (stdin)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for your program..."
            className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
          />
        </motion.div>
      )}

      {/* Editor */}
      <div className="h-96">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={(editor) => { editorRef.current = editor; }}
          options={editorOptions}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          loading={
            <div className="flex items-center justify-center h-full">
              <motion.div 
                className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          }
        />
      </div>

      {/* Output Section */}
      {showOutput && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
            </div>
            
            {(executionTime > 0 || memoryUsage > 0) && (
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {executionTime > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{executionTime}ms</span>
                  </div>
                )}
                {memoryUsage > 0 && (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{memoryUsage}MB</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="h-32 overflow-y-auto">
            <pre className="p-4 text-sm font-mono text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 whitespace-pre-wrap">
              {output || 'No output yet. Run your code to see results.'}
            </pre>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Test Results: {testResults.filter(r => r.passed).length}/{testResults.length} passed
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded text-xs ${
                      result.passed 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Test Case {index + 1}: {result.passed ? 'PASSED' : 'FAILED'}</span>
                    <span className="text-gray-500">({result.executionTime}ms)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Language: {languages.find(l => l.value === language)?.label}</span>
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-1">
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span>Running...</span>
            </div>
          )}
          <span>Ready</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RealTimeCompiler;