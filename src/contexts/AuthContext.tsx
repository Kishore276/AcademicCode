import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/dataService';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  rating: number;
  rank: string;
  problemsSolved: number;
  role: 'admin' | 'teacher' | 'student';
  department?: string;
  year?: number;
  enrollmentId?: string;
  teacherId?: string;
  permissions?: string[];
  lastActive?: string;
  joinDate?: string;
  isOnline?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: 'admin' | 'teacher' | 'student') => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: 'teacher' | 'student', additionalInfo?: any) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('academic_code_current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify user still exists in data
        const currentUser = userService.getUserById(userData.id);
        if (currentUser) {
          setUser(currentUser);
          // Update last active
          userService.updateUser(userData.id, { 
            lastActive: new Date().toISOString(),
            isOnline: true 
          });
        } else {
          localStorage.removeItem('academic_code_current_user');
        }
      } catch (error) {
        localStorage.removeItem('academic_code_current_user');
      }
    }
  }, []);

  const isAuthenticated = !!user;

  const login = async (username: string, password: string, role: 'admin' | 'teacher' | 'student') => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials against local data
      const foundUser = userService.getUserByCredentials(username, password, role);
      
      if (foundUser) {
        // Update user status
        const updatedUser = userService.updateUser(foundUser.id, {
          lastActive: new Date().toISOString(),
          isOnline: true
        });
        
        setUser(updatedUser);
        localStorage.setItem('academic_code_current_user', JSON.stringify(updatedUser));
        toast.success(`Welcome back, ${username}!`);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Invalid username, password, or role combination');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      // Update user status
      userService.updateUser(user.id, {
        lastActive: new Date().toISOString(),
        isOnline: false
      });
    }
    
    setUser(null);
    localStorage.removeItem('academic_code_current_user');
    toast.success('Logged out successfully');
  };

  const register = async (username: string, email: string, password: string, role: 'teacher' | 'student', additionalInfo?: any) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if username already exists
      const existingUsers = userService.getUsers();
      const userExists = existingUsers.some((u: any) => u.username === username || u.email === email);
      
      if (userExists) {
        throw new Error('Username or email already exists');
      }
      
      const userData = {
        username,
        email,
        password,
        role,
        rating: role === 'student' ? 1200 : 0,
        rank: role === 'student' ? 'Newbie' : 'Educator',
        problemsSolved: 0,
        isOnline: true,
        ...additionalInfo
      };
      
      const newUser = userService.createUser(userData);
      setUser(newUser);
      localStorage.setItem('academic_code_current_user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = userService.updateUser(user.id, data);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('academic_code_current_user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register, 
      updateProfile,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};