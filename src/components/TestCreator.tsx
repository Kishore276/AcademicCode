import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, Clock, Users, BookOpen } from 'lucide-react';
import CodeEditor from './CodeEditor';
import toast from 'react-hot-toast';

interface TestQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  starterCode: string;
  testCases: TestCase[];
  points: number;
  timeLimit: number;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalPoints: number;
  questions: TestQuestion[];
  isPublished: boolean;
  dueDate: string;
  allowedLanguages: string[];
}

const TestCreator: React.FC = () => {
  const [test, setTest] = useState<Test>({
    id: '',
    title: '',
    description: '',
    duration: 60,
    totalPoints: 0,
    questions: [],
    isPublished: false,
    dueDate: '',
    allowedLanguages: ['javascript', 'python', 'java']
  });

  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion>({
    id: '',
    title: '',
    description: '',
    difficulty: 'Easy',
    language: 'javascript',
    starterCode: '',
    testCases: [],
    points: 10,
    timeLimit: 30
  });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      input: '',
      expectedOutput: '',
      isHidden: false
    };
    setCurrentQuestion({
      ...currentQuestion,
      testCases: [...currentQuestion.testCases, newTestCase]
    });
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: any) => {
    setCurrentQuestion({
      ...currentQuestion,
      testCases: currentQuestion.testCases.map(tc =>
        tc.id === id ? { ...tc, [field]: value } : tc
      )
    });
  };

  const removeTestCase = (id: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      testCases: currentQuestion.testCases.filter(tc => tc.id !== id)
    });
  };

  const saveQuestion = () => {
    if (!currentQuestion.title || !currentQuestion.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const questionToSave = {
      ...currentQuestion,
      id: currentQuestion.id || Date.now().toString()
    };

    if (currentQuestion.id) {
      // Update existing question
      setTest({
        ...test,
        questions: test.questions.map(q =>
          q.id === currentQuestion.id ? questionToSave : q
        )
      });
    } else {
      // Add new question
      setTest({
        ...test,
        questions: [...test.questions, questionToSave]
      });
    }

    // Reset form
    setCurrentQuestion({
      id: '',
      title: '',
      description: '',
      difficulty: 'Easy',
      language: 'javascript',
      starterCode: '',
      testCases: [],
      points: 10,
      timeLimit: 30
    });
    setShowQuestionForm(false);
    toast.success('Question saved successfully!');
  };

  const editQuestion = (question: TestQuestion) => {
    setCurrentQuestion(question);
    setShowQuestionForm(true);
  };

  const deleteQuestion = (id: string) => {
    setTest({
      ...test,
      questions: test.questions.filter(q => q.id !== id)
    });
    toast.success('Question deleted');
  };

  const saveTest = () => {
    if (!test.title || test.questions.length === 0) {
      toast.error('Please add a title and at least one question');
      return;
    }

    const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);
    const testToSave = {
      ...test,
      id: test.id || Date.now().toString(),
      totalPoints
    };

    // Save to localStorage for demo
    const savedTests = JSON.parse(localStorage.getItem('academic_code_tests') || '[]');
    const existingIndex = savedTests.findIndex((t: Test) => t.id === testToSave.id);
    
    if (existingIndex >= 0) {
      savedTests[existingIndex] = testToSave;
    } else {
      savedTests.push(testToSave);
    }
    
    localStorage.setItem('academic_code_tests', JSON.stringify(savedTests));
    toast.success('Test saved successfully!');
  };

  const publishTest = () => {
    if (!test.title || test.questions.length === 0) {
      toast.error('Please complete the test before publishing');
      return;
    }

    setTest({ ...test, isPublished: true });
    saveTest();
    toast.success('Test published successfully!');
  };

  const getStarterCode = (language: string) => {
    const templates = {
      javascript: `function solution() {
    // Your code here
    
}`,
      python: `def solution():
    # Your code here
    pass`,
      java: `public class Solution {
    public static void main(String[] args) {
        // Your code here
        
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    // Your code here
    
    return 0;
}`
    };
    return templates[language as keyof typeof templates] || '';
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Preview</h2>
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Editor
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{test.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{test.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="text-gray-700 dark:text-gray-300">{test.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-secondary-500" />
              <span className="text-gray-700 dark:text-gray-300">{test.questions.length} questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent-500" />
              <span className="text-gray-700 dark:text-gray-300">{test.totalPoints} points</span>
            </div>
          </div>
        </div>

        {test.questions.map((question, index) => (
          <div key={question.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Question {index + 1}: {question.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty} • {question.points} points
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{question.description}</p>
            
            <CodeEditor
              language={question.language}
              value={question.starterCode}
              onChange={() => {}}
              readOnly={true}
              height="200px"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Create New Test
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={saveTest}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={publishTest}
            className="flex items-center space-x-2 bg-gradient-to-r from-success-500 to-emerald-500 hover:from-success-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <span>Publish Test</span>
          </button>
        </div>
      </div>

      {/* Test Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Test Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Title *
            </label>
            <input
              type="text"
              value={test.title}
              onChange={(e) => setTest({ ...test, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="Enter test title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={test.duration}
              onChange={(e) => setTest({ ...test, duration: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={test.description}
              onChange={(e) => setTest({ ...test, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="Enter test description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={test.dueDate}
              onChange={(e) => setTest({ ...test, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Questions ({test.questions.length})
          </h3>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>

        {test.questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No questions added yet. Click "Add Question" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {test.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {index + 1}. {question.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {question.difficulty} • {question.points} points • {question.language}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editQuestion(question)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentQuestion.id ? 'Edit Question' : 'Add New Question'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Question Title *
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.title}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter question title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={currentQuestion.difficulty}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Programming Language
                  </label>
                  <select
                    value={currentQuestion.language}
                    onChange={(e) => setCurrentQuestion({ 
                      ...currentQuestion, 
                      language: e.target.value,
                      starterCode: getStarterCode(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Description *
                </label>
                <textarea
                  value={currentQuestion.description}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the problem statement..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Starter Code
                </label>
                <CodeEditor
                  language={currentQuestion.language}
                  value={currentQuestion.starterCode}
                  onChange={(value) => setCurrentQuestion({ ...currentQuestion, starterCode: value })}
                  height="200px"
                />
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test Cases
                  </label>
                  <button
                    onClick={addTestCase}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Test Case</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentQuestion.testCases.map((testCase, index) => (
                    <div key={testCase.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Test Case {index + 1}</h4>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={testCase.isHidden}
                              onChange={(e) => updateTestCase(testCase.id, 'isHidden', e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Hidden</span>
                          </label>
                          <button
                            onClick={() => removeTestCase(testCase.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Input
                          </label>
                          <textarea
                            value={testCase.input}
                            onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                            placeholder="Enter input..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expected Output
                          </label>
                          <textarea
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                            placeholder="Enter expected output..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowQuestionForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCreator;