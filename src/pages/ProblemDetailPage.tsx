import React, { useState, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Save, TimerReset as Reset, ThumbsUp, MessageSquare, Share, Check, X, Clock } from 'lucide-react';
import { compilerService } from '../services/compilerService';
import { problemService, submissionService, userService } from '../services/dataService';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import toast from 'react-hot-toast';

const LiveCodeEditor = React.lazy(() => import('../components/RealTimeFeatures/LiveCodeEditor'));
const ProblemDiscussion = React.lazy(() => import('../components/RealTimeFeatures/ProblemDiscussion'));

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [code, setCode] = useState(`function twoSum(nums, target) {\n    // Your solution here\n\n}`);
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [verdict, setVerdict] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState([]);
  const [testResults, setTestResults] = useState<any>(null);

  const problem = {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.'
    ],
    likes: 1247,
    dislikes: 45,
    acceptance: 85.2,
    solved: false,
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' }
    ]
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setTestOutput('');
    setVerdict(null);
    try {
      const result = await compilerService.executeCode(code, language, testInput);
      setTestOutput(result.output);
      setVerdict(result.error ? 'Error' : 'Success');
      // Save submission to history
      const newSubmission = submissionService.createSubmission({
        problemId: id,
        userId: userService.getUser().id,
        code,
        language,
        input: testInput,
        output: result.output,
        verdict: result.error ? 'Error' : 'Success',
        type: 'run',
      });
      setSubmissions([...submissions, newSubmission]);
    } catch (err) {
      setTestOutput('Runtime Error');
      setVerdict('Error');
    }
    setIsRunning(false);
  };

  const submitCode = async () => {
    setIsRunning(true);
    setTestResults(null);
    setVerdict(null);
    try {
      const results = await compilerService.validateSolution(code, language, problem.testCases);
      setTestResults(results);
      const allPassed = results.every((r: any) => r.passed);
      setVerdict(allPassed ? 'Accepted' : 'Wrong Answer');
      // Save submission to history
      const newSubmission = submissionService.createSubmission({
        problemId: id,
        userId: userService.getUser().id,
        code,
        language,
        input: testInput,
        output: results.map((r: any) => r.actualOutput).join('\n'),
        verdict: allPassed ? 'Accepted' : 'Wrong Answer',
        type: 'submit',
      });
      setSubmissions([...submissions, newSubmission]);
    } catch (err) {
      setVerdict('Error');
    }
    setIsRunning(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100 dark:bg-success-900/30';
      case 'Medium': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      case 'Hard': return 'text-error-600 bg-error-100 dark:bg-error-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  useEffect(() => {
    const handleBlur = () => toast('Warning: Tab switch detected!');
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  const handleCopy = () => toast('Copy detected!');
  const handlePaste = () => toast('Paste detected!');

  useEffect(() => {
    async function fetchSubs() {
      const allSubs = await submissionService.getSubmissions();
      setSubmissions(allSubs.filter((s: any) => s.problemId === id && s.userId === userService.getUser().id));
    }
    if (id && userService.getUser()) fetchSubs();
  }, [id, userService.getUser()]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {problem.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{problem.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>42 discussions</span>
                </div>
                <div>
                  <span>{problem.acceptance}% acceptance</span>
                </div>
                <button className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {problem.description}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Examples</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      Example {index + 1}:
                    </div>
                    <div className="text-sm space-y-1">
                      <div><strong>Input:</strong> {example.input}</div>
                      <div><strong>Output:</strong> {example.output}</div>
                      {example.explanation && (
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Constraints</h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>• {constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Code Editor & Real-Time Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Reset className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Real-time Code Editor */}
            <div className="h-72">
              <Suspense fallback={<LoadingSpinner />}>
                <LiveCodeEditor
                  roomId={`problem-${id}`}
                  language={language}
                  value={code}
                  onChange={setCode}
                  showCollaboration={true}
                  height="100%"
                  readOnly={false}
                  onCopy={handleCopy}
                  onPaste={handlePaste}
                />
              </Suspense>
            </div>
            {/* Test Case Input/Output */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Input</label>
                <textarea
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                  rows={2}
                  placeholder="Enter custom input (optional)"
                />
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg disabled:opacity-60"
                >
                  <Play className="h-5 w-5" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
                <button
                  onClick={submitCode}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg disabled:opacity-60"
                >
                  <Check className="h-5 w-5" />
                  <span>{isRunning ? 'Submitting...' : 'Submit'}</span>
                </button>
                {verdict && (
                  <span className={`ml-4 px-3 py-1 rounded-full text-sm font-bold ${verdict === 'Accepted' ? 'bg-green-100 text-green-700' : verdict === 'Wrong Answer' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {verdict}
                  </span>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output</label>
                <textarea
                  value={testOutput}
                  readOnly
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                  rows={2}
                  placeholder="Output will appear here"
                />
              </div>
              {/* Show test results for submission */}
              {testResults && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Test Results</h4>
                  <ul className="space-y-2">
                    {testResults.map((result: any, idx: number) => (
                      <li key={idx} className={`flex items-center space-x-3 p-2 rounded-lg ${result.passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <span className="font-mono text-xs">Input: {result.input}</span>
                        <span className="font-mono text-xs">Expected: {result.expectedOutput}</span>
                        <span className="font-mono text-xs">Actual: {result.actualOutput}</span>
                        <span className={`font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>{result.passed ? 'Passed' : 'Failed'}</span>
                        {result.error && <span className="text-xs text-red-500">{result.error}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Submissions History */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Submissions History</h4>
              {submissions.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No submissions yet.</div>
              ) : (
                <ul className="space-y-2 max-h-32 overflow-y-auto">
                  {submissions.map((sub, idx) => (
                    <li key={idx} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                      <span className="font-mono text-xs">{sub.time}</span>
                      <span className={`font-bold ${sub.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>{sub.verdict}</span>
                      <span className="text-xs text-gray-400">{sub.language}</span>
                      <button
                        className="ml-auto px-2 py-1 text-xs bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg"
                        onClick={() => { setCode(sub.code); setLanguage(sub.language); }}
                      >
                        Load Code
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Problem Discussion Section */}
            <Suspense fallback={<LoadingSpinner />}>
              <ProblemDiscussion problemId={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;