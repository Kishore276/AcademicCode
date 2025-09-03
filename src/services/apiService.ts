import axios from 'axios';
import { useStore } from '../store/useStore';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const { setUser, setAuthenticated } = useStore.getState();
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Authentication
  async login(credentials: { username: string; password: string; role: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: any) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    return response.data;
  }

  // User Management
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await api.put('/users/profile', data);
    return response.data;
  }

  async getUsers(params?: any) {
    const response = await api.get('/users', { params });
    return response.data;
  }

  async createUser(userData: any) {
    const response = await api.post('/users', userData);
    return response.data;
  }

  async updateUser(id: string, data: any) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  // Problems
  async getProblems(params?: any) {
    const response = await api.get('/problems', { params });
    return response.data;
  }

  async getProblem(id: string) {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  }

  async createProblem(problemData: any) {
    const response = await api.post('/problems', problemData);
    return response.data;
  }

  async updateProblem(id: string, data: any) {
    const response = await api.put(`/problems/${id}`, data);
    return response.data;
  }

  async deleteProblem(id: string) {
    const response = await api.delete(`/problems/${id}`);
    return response.data;
  }

  async submitSolution(problemId: string, solution: any) {
    const response = await api.post(`/problems/${problemId}/submit`, solution);
    return response.data;
  }

  async runCode(code: string, language: string, input?: string) {
    const response = await api.post('/code/run', { code, language, input });
    return response.data;
  }

  // Assessments
  async getAssessments(params?: any) {
    const response = await api.get('/assessments', { params });
    return response.data;
  }

  async getAssessment(id: string) {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  }

  async createAssessment(assessmentData: any) {
    const response = await api.post('/assessments', assessmentData);
    return response.data;
  }

  async updateAssessment(id: string, data: any) {
    const response = await api.put(`/assessments/${id}`, data);
    return response.data;
  }

  async deleteAssessment(id: string) {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  }

  async startAssessment(id: string) {
    const response = await api.post(`/assessments/${id}/start`);
    return response.data;
  }

  async submitAssessment(id: string, submission: any) {
    const response = await api.post(`/assessments/${id}/submit`, submission);
    return response.data;
  }

  // Contests
  async getContests(params?: any) {
    const response = await api.get('/contests', { params });
    return response.data;
  }

  async getContest(id: string) {
    const response = await api.get(`/contests/${id}`);
    return response.data;
  }

  async registerForContest(id: string) {
    const response = await api.post(`/contests/${id}/register`);
    return response.data;
  }

  async getContestLeaderboard(id: string) {
    const response = await api.get(`/contests/${id}/leaderboard`);
    return response.data;
  }

  // Learning Paths
  async getLearningPaths(params?: any) {
    const response = await api.get('/learning-paths', { params });
    return response.data;
  }

  async getLearningPath(id: string) {
    const response = await api.get(`/learning-paths/${id}`);
    return response.data;
  }

  async enrollInLearningPath(id: string) {
    const response = await api.post(`/learning-paths/${id}/enroll`);
    return response.data;
  }

  async updateProgress(pathId: string, moduleId: string, progress: any) {
    const response = await api.put(`/learning-paths/${pathId}/modules/${moduleId}/progress`, progress);
    return response.data;
  }

  // Analytics
  async getAnalytics(type: string, params?: any) {
    const response = await api.get(`/analytics/${type}`, { params });
    return response.data;
  }

  async getUserAnalytics(userId: string) {
    const response = await api.get(`/analytics/users/${userId}`);
    return response.data;
  }

  async getSystemAnalytics() {
    const response = await api.get('/analytics/system');
    return response.data;
  }

  // File Operations
  async uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async downloadFile(fileId: string) {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Notifications
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  }

  async markNotificationAsRead(id: string) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  }

  async deleteNotification(id: string) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }

  // Real-time Collaboration
  async createRoom(roomData: any) {
    const response = await api.post('/rooms', roomData);
    return response.data;
  }

  async joinRoom(roomId: string) {
    const response = await api.post(`/rooms/${roomId}/join`);
    return response.data;
  }

  async leaveRoom(roomId: string) {
    const response = await api.post(`/rooms/${roomId}/leave`);
    return response.data;
  }

  async getRoomHistory(roomId: string) {
    const response = await api.get(`/rooms/${roomId}/history`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default api;