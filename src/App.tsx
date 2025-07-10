import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { socketService } from './services/socketService';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import ContestsPage from './pages/ContestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import LearningPathsPage from './pages/LearningPathsPage';
import LearningPathDetailPage from './pages/LearningPathDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentDetailPage from './pages/AssessmentDetailPage';
import JavaLearningPath from './pages/JavaLearningPath';
import PythonLearningPath from './pages/PythonLearningPath';
import PracticeArena from './pages/PracticeArena';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/layout/ErrorBoundary';
import LoadingSpinner from './components/layout/LoadingSpinner';

function AppContent() {
  const { user, isAuthenticated, addNotification } = useStore();
  const { isAuthenticated: authIsAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Initialize real-time features for authenticated users
    if (isAuthenticated && user) {
      socketService.connect(user.id);
      
      // Add welcome notification
      addNotification({
        type: 'info',
        title: 'Welcome back!',
        message: `Hello ${user.username}, ready to code?`,
        read: false,
      });

      // Simulate some real-time notifications for demo
      setTimeout(() => {
        addNotification({
          type: 'success',
          title: 'New Contest Available',
          message: 'Weekly Algorithm Challenge #48 is now open for registration!',
          read: false,
        });
      }, 3000);

      setTimeout(() => {
        addNotification({
          type: 'warning',
          title: 'Assessment Reminder',
          message: 'Data Structures Midterm Exam is due in 2 days',
          read: false,
        });
      }, 6000);
    }

    return () => {
      if (isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, user, addNotification]);

  // ProtectedRoute for authentication
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!authIsAuthenticated) {
      return <NotFoundPage />;
    }
    return children;
  };

  // RoleProtectedRoute for role-based access
  const RoleProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
    const { user: authUser } = useAuth();
    if (!authIsAuthenticated || !authUser || !allowedRoles.includes(authUser.role)) {
      return <NotFoundPage />;
    }
    return children;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<PracticeArena />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:id" element={<ProblemDetailPage />} />
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/learning-paths" element={<LearningPathsPage />} />
            <Route path="/learning-paths/:id" element={<LearningPathDetailPage />} />
            <Route path="/learning-paths/java" element={<JavaLearningPath />} />
            <Route path="/learning-paths/python" element={<PythonLearningPath />} />
            <Route path="/admin" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/teacher" element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/assessments/:id" element={<AssessmentDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;