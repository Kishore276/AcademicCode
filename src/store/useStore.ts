import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dataService } from '../services/dataService';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  rating: number;
  rank: string;
  problemsSolved: number;
  department?: string;
  year?: number;
  enrollmentId?: string;
  teacherId?: string;
  permissions?: string[];
  lastActive?: string;
  joinDate?: string;
  isOnline?: boolean;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
    emailUpdates: boolean;
  };
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  solved: boolean;
  acceptance: number;
  likes: number;
  dislikes: number;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
  timeLimit: number;
  memoryLimit: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  endTime: string;
  duration: string;
  participants: number;
  problems: string[];
  prizes: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  registrationDeadline: string;
  rules: string[];
  createdBy: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  course: string;
  instructor: string;
  dueDate: string;
  duration: number;
  problems: string[];
  maxScore: number;
  status: 'draft' | 'published' | 'active' | 'ended';
  allowedLanguages: string[];
  instructions: string[];
  proctoring: {
    enabled: boolean;
    webcam: boolean;
    screenShare: boolean;
    lockdown: boolean;
  };
  grading: {
    autoGrade: boolean;
    showResults: boolean;
    partialCredit: boolean;
  };
  submissions: Array<{
    studentId: string;
    submittedAt: string;
    score: number;
    status: 'submitted' | 'graded' | 'late';
  }>;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  problems: number;
  enrolled: number;
  rating: number;
  category: string;
  tags: string[];
  progress?: number;
  modules: Array<{
    id: number;
    title: string;
    description: string;
    problems: number;
    completed: number;
    duration: string;
    topics: string[];
    prerequisites?: string[];
    learningObjectives: string[];
  }>;
  prerequisites: string[];
  learningObjectives: string[];
  certification: {
    available: boolean;
    requirements: string[];
    validityPeriod: string;
  };
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'code' | 'file' | 'system';
  metadata?: {
    language?: string;
    fileName?: string;
    fileSize?: number;
  };
}

interface Room {
  id: string;
  name: string;
  type: 'study' | 'contest' | 'assessment' | 'collaboration';
  participants: string[];
  maxParticipants: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  settings: {
    allowChat: boolean;
    allowScreenShare: boolean;
    allowFileShare: boolean;
    moderationEnabled: boolean;
  };
}

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Theme
  theme: 'light' | 'dark';
  
  // Data
  problems: Problem[];
  contests: Contest[];
  assessments: Assessment[];
  learningPaths: LearningPath[];
  notifications: Notification[];
  users: User[];
  
  // Real-time features
  onlineUsers: User[];
  activeRooms: Room[];
  currentRoom: Room | null;
  chatMessages: ChatMessage[];
  
  // UI State
  sidebarOpen: boolean;
  notificationsPanelOpen: boolean;
  chatPanelOpen: boolean;
  
  // Code Editor State
  currentCode: string;
  currentLanguage: string;
  editorSettings: {
    fontSize: number;
    theme: string;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
  };
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setNotificationsPanelOpen: (open: boolean) => void;
  setChatPanelOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setCurrentRoom: (room: Room | null) => void;
  updateOnlineUsers: (users: User[]) => void;
  setCurrentCode: (code: string) => void;
  setCurrentLanguage: (language: string) => void;
  updateEditorSettings: (settings: Partial<AppState['editorSettings']>) => void;
  addProblem: (problem: Problem) => void;
  updateProblem: (id: string, updates: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  fetchProblems: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      theme: 'light',
      problems: [],
      contests: [],
      assessments: [],
      learningPaths: [],
      notifications: [],
      users: [],
      onlineUsers: [],
      activeRooms: [],
      currentRoom: null,
      chatMessages: [],
      sidebarOpen: true,
      notificationsPanelOpen: false,
      chatPanelOpen: false,
      currentCode: '',
      currentLanguage: 'javascript',
      editorSettings: {
        fontSize: 14,
        theme: 'vs-dark',
        wordWrap: true,
        minimap: false,
        lineNumbers: true,
      },

      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setNotificationsPanelOpen: (open) => set({ notificationsPanelOpen: open }),
      setChatPanelOpen: (open) => set({ chatPanelOpen: open }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [
          ...state.chatMessages,
          {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          },
        ],
      })),
      
      setCurrentRoom: (room) => set({ currentRoom: room }),
      updateOnlineUsers: (users) => set({ onlineUsers: users }),
      setCurrentCode: (code) => set({ currentCode: code }),
      setCurrentLanguage: (language) => set({ currentLanguage: language }),
      
      updateEditorSettings: (settings) => set((state) => ({
        editorSettings: { ...state.editorSettings, ...settings },
      })),
      
      addProblem: (problem) => set((state) => ({
        problems: [...state.problems, problem],
      })),
      
      updateProblem: (id, updates) => set((state) => ({
        problems: state.problems.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      
      deleteProblem: (id) => set((state) => ({
        problems: state.problems.filter((p) => p.id !== id),
      })),
      
      addAssessment: (assessment) => set((state) => ({
        assessments: [...state.assessments, assessment],
      })),
      
      updateAssessment: (id, updates) => set((state) => ({
        assessments: state.assessments.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      })),
      
      deleteAssessment: (id) => set((state) => ({
        assessments: state.assessments.filter((a) => a.id !== id),
      })),

      fetchProblems: async () => {
        const problems = dataService.problemService.getProblems();
        set({ problems });
      },
      fetchUsers: async () => {
        const users = dataService.userService.getUsers();
        set({ users });
      },
      addUser: async (user: Partial<User>) => {
        const newUser = dataService.userService.createUser(user);
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUser: async (id: string, updates: Partial<User>) => {
        const updatedUser = dataService.userService.updateUser(id, updates);
        if (updatedUser) {
          set((state) => ({
            users: state.users.map((u) => (u.id === id ? updatedUser : u)),
          }));
        }
      },
      deleteUser: async (id: string) => {
        dataService.userService.deleteUser(id);
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
      },
    }),
    {
      name: 'academic-code-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        editorSettings: state.editorSettings,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);