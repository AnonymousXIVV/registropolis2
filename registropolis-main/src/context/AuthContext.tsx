
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import { authAPI } from '@/services/apiService';

// User type
type User = {
  id: string;
  phoneNumber: string;
  name: string;
  profileImageUrl?: string;
  email?: string; // Adding email property for forms
  role?: string; // Adding role property for admin detection
};

// Auth context state
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean; // New property to check if user is admin
  phoneNumber: string;
  isOtpSent: boolean;
  isPhoneVerified: boolean; 
  signIn: (user: User) => void;
  signOut: () => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setIsOtpSent: (isOtpSent: boolean) => void;
  setIsPhoneVerified: (isVerified: boolean) => void;
  refreshUser: () => Promise<void>;
  addAdmin: (email: string, role?: string) => Promise<void>; // New function to add admin
}

// Default context values
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  phoneNumber: '',
  isOtpSent: false,
  isPhoneVerified: false,
  signIn: () => {},
  signOut: () => {},
  setPhoneNumber: () => {},
  setIsOtpSent: () => {},
  setIsPhoneVerified: () => {},
  refreshUser: async () => {},
  addAdmin: async () => {}
};

// Create the auth context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('auth_token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          
          // Verify token validity by calling the API
          try {
            const response = await authAPI.getCurrentUser();
            if (response && response.user) {
              setUser(response.user);
            } else {
              throw new Error('Invalid user data');
            }
          } catch (error) {
            // If token is invalid, clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Sign in user
  const signIn = (userData: User) => {
    // In a real implementation, this would be after successful API authentication
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    toast.success("Welcome! You are now signed in");
  };

  // Sign out user
  const signOut = async () => {
    try {
      // Call logout API if authenticated
      if (user) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      setUser(null);
      
      toast.success("Signed out successfully");
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Add an admin
  const addAdmin = async (email: string, role: string = 'admin') => {
    try {
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admins can add other admins');
      }
      
      // Fix: Pass just the email as string parameter, which is what the API expects
      await authAPI.addAdmin(email);
      toast.success(`User ${email} was successfully made an ${role}`);
      
    } catch (error) {
      console.error('Failed to add admin:', error);
      toast.error('Failed to add admin: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Check if user is admin
  const isAdmin = useMemo(() => {
    if (!user) return false;
    
    // Check if user has admin role or email is "admin"
    return user.role === 'admin' || user.email === 'admin';
  }, [user]);

  // Memoize the context value
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin,
      phoneNumber,
      isOtpSent,
      isPhoneVerified,
      signIn,
      signOut,
      setPhoneNumber,
      setIsOtpSent,
      setIsPhoneVerified,
      refreshUser,
      addAdmin
    }),
    [user, isLoading, isAdmin, phoneNumber, isOtpSent, isPhoneVerified]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
