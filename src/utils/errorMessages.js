// Firebase error code to human-friendly message mapping
export const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    // Authentication errors
    'auth/user-not-found': 'No account found with this email address. Please check your email or create a new account.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Please contact support for assistance.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later or reset your password.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    
    // Registration errors
    'auth/email-already-in-use': 'Email already exists. Please sign in or use a different email.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password with at least 8 characters.',
    'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',
    
    // Google sign-in errors
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    
    // General errors
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/requires-recent-login': 'Please sign out and sign in again to complete this action.',
    'auth/credential-already-in-use': 'This credential is already associated with a different account.',
    
    // Default fallback
    'default': 'Something went wrong. Please try again or contact support if the problem persists.'
  };
  
  return errorMessages[errorCode] || errorMessages['default'];
};

// Extract error code from Firebase error object
export const extractErrorCode = (error) => {
  if (error?.code) {
    return error.code;
  }
  
  // Handle cases where error message contains the code
  if (error?.message) {
    const codeMatch = error.message.match(/\(([^)]+)\)/);
    if (codeMatch) {
      return codeMatch[1];
    }
  }
  
  return 'default';
};

// Main function to get user-friendly error message
export const getErrorMessage = (error) => {
  const errorCode = extractErrorCode(error);
  return getFirebaseErrorMessage(errorCode);
};