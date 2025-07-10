const API_BASE_URL = 'http://localhost:5000/api';

// Import local data
import usersData from '../data/users.json';
import problemsData from '../data/problems.json';
import contestsData from '../data/contests.json';
import submissionsData from '../data/submissions.json';
import assessmentsData from '../data/assessments.json';
import learningPathsData from '../data/learningPaths.json';
import mcqQuestionsData from '../data/mcqQuestions.json';
import theoryQuestionsData from '../data/theoryQuestions.json';

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Local data storage (for development)
let localUsers = [...(usersData.users || usersData)];
let localProblems = [...(problemsData.problems || problemsData)];
let localContests = [...(contestsData.contests || contestsData)];
let localSubmissions = [...(submissionsData.submissions || submissionsData)];
let localAssessments = [...(assessmentsData.assessments || assessmentsData)];
let localLearningPaths = [...(learningPathsData.learningPaths || learningPathsData)];

// User related API calls and local methods
export const userService = {
  // Local data methods (for development)
  getUsers() {
    return localUsers;
  },

  getUserById(id: string) {
    return localUsers.find(user => user.id === id) || null;
  },

  getUserByCredentials(username: string, password: string, role: string) {
    return localUsers.find(user => 
      user.username === username && 
      user.password === password && 
      user.role === role
    ) || null;
  },

  createUser(userData: any) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localUsers.push(newUser);
    return newUser;
  },

  updateUser(id: string, updates: any) {
    const index = localUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      localUsers[index] = { ...localUsers[index], ...updates, updatedAt: new Date().toISOString() };
      return localUsers[index];
    }
    return null;
  },

  deleteUser(id: string) {
    const index = localUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      localUsers.splice(index, 1);
      return true;
    }
    return false;
  },

  // API methods
  async getAllUsers() {
    return await apiCall('/users');
  },

  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: string;
  }) {
    return await apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async loginUser(credentials: { email: string; password: string }) {
    return await apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async updateUserProfile(id: string, profileData: {
    name?: string;
    bio?: string;
    skills?: string[];
    experience?: string;
  }) {
    return await apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async deleteUserAPI(id: string) {
    return await apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Problem related API calls and local methods
export const problemService = {
  // Local data methods
  getProblems() {
    return localProblems;
  },

  getProblemById(id: string) {
    return localProblems.find(problem => problem.id === id) || null;
  },

  createProblem(problemData: any) {
    const newProblem = {
      id: Date.now().toString(),
      ...problemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localProblems.push(newProblem);
    return newProblem;
  },

  updateProblem(id: string, updates: any) {
    const index = localProblems.findIndex(problem => problem.id === id);
    if (index !== -1) {
      localProblems[index] = { ...localProblems[index], ...updates, updatedAt: new Date().toISOString() };
      return localProblems[index];
    }
    return null;
  },

  deleteProblem(id: string) {
    const index = localProblems.findIndex(problem => problem.id === id);
    if (index !== -1) {
      localProblems.splice(index, 1);
      return true;
    }
    return false;
  },

  // API methods
  async getAllProblems(filters?: {
    difficulty?: string;
    category?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    return await apiCall(`/problems${queryString ? `?${queryString}` : ''}`);
  },

  async getProblemByIdAPI(id: string) {
    return await apiCall(`/problems/${id}`);
  },

  async createProblemAPI(problemData: {
    title: string;
    description: string;
    difficulty: string;
    category: string;
    tags?: string[];
    testCases?: Array<{
      input: string;
      output: string;
      description?: string;
    }>;
    constraints?: {
      timeLimit?: number;
      memoryLimit?: number;
      inputFormat?: string;
      outputFormat?: string;
    };
    solution?: {
      code?: string;
      language?: string;
      explanation?: string;
    };
    createdBy?: string;
  }) {
    return await apiCall('/problems', {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  },

  async updateProblemAPI(id: string, problemData: any) {
    return await apiCall(`/problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(problemData),
    });
  },

  async deleteProblemAPI(id: string) {
    return await apiCall(`/problems/${id}`, {
      method: 'DELETE',
    });
  },

  async getProblemsByCategory(category: string) {
    return await apiCall(`/problems/category/${category}`);
  },

  async getProblemsByDifficulty(difficulty: string) {
    return await apiCall(`/problems/difficulty/${difficulty}`);
  },

  async updateProblemStats(id: string, stats: {
    submissions?: number;
    accepted?: number;
  }) {
    return await apiCall(`/problems/${id}/stats`, {
      method: 'PATCH',
      body: JSON.stringify(stats),
    });
  },
};

// Contest related API calls and local methods
export const contestService = {
  // Local data methods
  getContests() {
    return localContests;
  },

  getContestById(id: string) {
    return localContests.find(contest => contest.id === id) || null;
  },

  createContest(contestData: any) {
    const newContest = {
      id: Date.now().toString(),
      ...contestData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localContests.push(newContest);
    return newContest;
  },

  updateContest(id: string, updates: any) {
    const index = localContests.findIndex(contest => contest.id === id);
    if (index !== -1) {
      localContests[index] = { ...localContests[index], ...updates, updatedAt: new Date().toISOString() };
      return localContests[index];
    }
    return null;
  },

  deleteContest(id: string) {
    const index = localContests.findIndex(contest => contest.id === id);
    if (index !== -1) {
      localContests.splice(index, 1);
      return true;
    }
    return false;
  },

  // API methods
  async getAllContests(filters?: {
    status?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    return await apiCall(`/contests${queryString ? `?${queryString}` : ''}`);
  },

  async getContestByIdAPI(id: string) {
    return await apiCall(`/contests/${id}`);
  },

  async createContestAPI(contestData: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    duration: number;
    problems?: string[];
    rules?: string[];
    prizes?: Array<{
      rank: number;
      description: string;
      value: string;
    }>;
    createdBy?: string;
  }) {
    return await apiCall('/contests', {
      method: 'POST',
      body: JSON.stringify(contestData),
    });
  },

  async updateContestAPI(id: string, contestData: any) {
    return await apiCall(`/contests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contestData),
    });
  },

  async deleteContestAPI(id: string) {
    return await apiCall(`/contests/${id}`, {
      method: 'DELETE',
    });
  },

  async joinContest(id: string, userId: string) {
    return await apiCall(`/contests/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async submitContestSolution(id: string, submissionData: {
    userId: string;
    problemId: string;
    code: string;
    language: string;
  }) {
    return await apiCall(`/contests/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  async getContestLeaderboard(id: string) {
    return await apiCall(`/contests/${id}/leaderboard`);
  },
};

// Submission related API calls and local methods
export const submissionService = {
  // Local data methods
  getSubmissions() {
    return localSubmissions;
  },

  getSubmissionById(id: string) {
    return localSubmissions.find(submission => submission.id === id) || null;
  },

  createSubmission(submissionData: any) {
    const newSubmission = {
      id: Date.now().toString(),
      ...submissionData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    localSubmissions.push(newSubmission);
    return newSubmission;
  },

  updateSubmission(id: string, updates: any) {
    const index = localSubmissions.findIndex(submission => submission.id === id);
    if (index !== -1) {
      localSubmissions[index] = { ...localSubmissions[index], ...updates };
      return localSubmissions[index];
    }
    return null;
  },

  // API methods
  async getAllSubmissions(filters?: {
    user?: string;
    problem?: string;
    status?: string;
    language?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.user) params.append('user', filters.user);
    if (filters?.problem) params.append('problem', filters.problem);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.language) params.append('language', filters.language);

    const queryString = params.toString();
    return await apiCall(`/submissions${queryString ? `?${queryString}` : ''}`);
  },

  async getSubmissionByIdAPI(id: string) {
    return await apiCall(`/submissions/${id}`);
  },

  async createSubmissionAPI(submissionData: {
    user: string;
    problem: string;
    contest?: string;
    code: string;
    language: string;
  }) {
    return await apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  async getUserSubmissions(userId: string) {
    return await apiCall(`/submissions/user/${userId}`);
  },

  async getProblemSubmissions(problemId: string) {
    return await apiCall(`/submissions/problem/${problemId}`);
  },

  async getSubmissionStats() {
    return await apiCall('/submissions/stats');
  },

  async rejudgeSubmission(id: string) {
    return await apiCall(`/submissions/${id}/rejudge`, {
      method: 'POST',
    });
  },
};

// Assessment related methods
export const assessmentService = {
  getAssessments() {
    return localAssessments;
  },

  getAssessmentById(id: string) {
    return localAssessments.find(assessment => assessment.id === id) || null;
  },

  createAssessment(assessmentData: any) {
    const newAssessment = {
      id: Date.now().toString(),
      ...assessmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localAssessments.push(newAssessment);
    return newAssessment;
  },

  updateAssessment(id: string, updates: any) {
    const index = localAssessments.findIndex(assessment => assessment.id === id);
    if (index !== -1) {
      localAssessments[index] = { ...localAssessments[index], ...updates, updatedAt: new Date().toISOString() };
      return localAssessments[index];
    }
    return null;
  },

  deleteAssessment(id: string) {
    const index = localAssessments.findIndex(assessment => assessment.id === id);
    if (index !== -1) {
      localAssessments.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Learning Path related methods
export const learningPathService = {
  getLearningPaths() {
    return localLearningPaths;
  },

  getLearningPathById(id: string) {
    return localLearningPaths.find(path => path.id === id) || null;
  },

  createLearningPath(pathData: any) {
    const newPath = {
      id: Date.now().toString(),
      ...pathData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localLearningPaths.push(newPath);
    return newPath;
  },

  updateLearningPath(id: string, updates: any) {
    const index = localLearningPaths.findIndex(path => path.id === id);
    if (index !== -1) {
      localLearningPaths[index] = { ...localLearningPaths[index], ...updates, updatedAt: new Date().toISOString() };
      return localLearningPaths[index];
    }
    return null;
  },

  deleteLearningPath(id: string) {
    const index = localLearningPaths.findIndex(path => path.id === id);
    if (index !== -1) {
      localLearningPaths.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Question data
export const questionService = {
  getMCQQuestions() {
    return mcqQuestionsData;
  },

  getTheoryQuestions() {
    return theoryQuestionsData;
  },

  getMCQQuestionById(id: string) {
    return mcqQuestionsData.find(question => question.id === id) || null;
  },

  getTheoryQuestionById(id: string) {
    return theoryQuestionsData.find(question => question.id === id) || null;
  },
};

// File upload service
export const fileService = {
  async uploadPDF(file: File, userRole: string, userId: string) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('userRole', userRole);
    formData.append('userId', userId);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PDF upload failed:', error);
      throw error;
    }
  },
};

// Health check service
export const healthService = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

// Export all services
export const dataService = {
  userService,
  problemService,
  contestService,
  submissionService,
  assessmentService,
  learningPathService,
  questionService,
  fileService,
  healthService,
};