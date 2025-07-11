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
import { app } from '@/firebase/firebase.config';
import { userAPI } from '@/utils/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorMessages';

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
  const [userRole, setUserRole] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Create or update user in backend
  const createOrUpdateUserInBackend = async (firebaseUser) => {
    try {
      const userData = {
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        image: firebaseUser.photoURL || null,
        phone: firebaseUser.phoneNumber || null
      };

      const response = await userAPI.createOrUpdateUser(userData);
      const backendUser = response.data.user;
      
      setUserDoc(backendUser);
      setUserRole(backendUser.role);
      
      // Store auth token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return backendUser;
    } catch (error) {
      console.error('Error creating/updating user in backend:', error);
      // Set default role if backend fails
      setUserRole('user');
      throw error;
    }
  };

  // Fetch user role from backend
  const fetchUserRole = async (firebaseUid) => {
    try {
      setRoleLoading(true);
      const response = await userAPI.getUserByUid(firebaseUid);
      const backendUser = response.data.user;
      
      setUserDoc(backendUser);
      setUserRole(backendUser.role);
      
      return backendUser;
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Set default role if fetch fails
      setUserRole('user');
      return null;
    } finally {
      setRoleLoading(false);
    }
  };

  // Register user with email and password
  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await updateProfile(result.user, {
        displayName: name
      });
      
      // Create user in backend
      await createOrUpdateUserInBackend(result.user);
      
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
      
      // Fetch or create user in backend
      await createOrUpdateUserInBackend(result.user);
      
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
      
      // Create or update user in backend
      await createOrUpdateUserInBackend(result.user);
      
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
      
      // Clear user data and token
      setUserRole(null);
      setUserDoc(null);
      localStorage.removeItem('authToken');
      
      toast.success('You have been signed out successfully.');
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  // Check if user is admin
  const isAdmin = () => {
    return userRole === 'admin';
  };

  // Check if user is member or admin
  const isMemberOrAdmin = () => {
    return userRole === 'member' || userRole === 'admin';
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user role from backend
        try {
          await fetchUserRole(currentUser.uid);
        } catch (error) {
          console.error('Error fetching user role on auth change:', error);
        }
      } else {
        // Clear user data when logged out
        setUserRole(null);
        setUserDoc(null);
        localStorage.removeItem('authToken');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    user,
    userRole,
    userDoc,
    loading,
    roleLoading,
    register,
    login,
    loginWithGoogle,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isMemberOrAdmin,
    fetchUserRole,
    createOrUpdateUserInBackend
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};