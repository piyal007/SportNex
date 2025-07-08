import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { app } from '../firebase/firebase.config';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorMessages';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Register user with email and password
  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await updateProfile(result.user, {
        displayName: name
      });
      
      toast.success('Welcome to SportNex! Your account has been created successfully.');
      return result;
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back! You have been signed in successfully.');
      return result;
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Welcome! You have been signed in with Google successfully.');
      return result;
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('You have been signed out successfully.');
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
      throw error;
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};