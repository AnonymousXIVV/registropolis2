
/**
 * Authentication utilities for temporary credentials and auth management
 */

// Temporary credentials for testing
export const TEMPORARY_CREDENTIALS = {
  admin: {
    email: "admin",
    phoneNumber: "+15555555555",
    password: "admin123", // For display purposes only - mock implementation doesn't validate passwords
    name: "Admin User"
  },
  user: {
    email: "user@example.com",
    phoneNumber: "+15555555556",
    password: "user123", // For display purposes only - mock implementation doesn't validate passwords
    name: "Regular User"
  }
};

/**
 * Store temporary user in localStorage for mock authentication
 */
export const setupTemporaryUser = (userType: 'admin' | 'user') => {
  const credentials = TEMPORARY_CREDENTIALS[userType];
  
  // Create mock user
  const userId = 'user_' + Math.random().toString(36).substring(2, 15);
  
  const user = {
    id: userId,
    phoneNumber: credentials.phoneNumber,
    name: credentials.name,
    email: credentials.email,
    role: userType === 'admin' ? 'admin' : 'user',
    createdAt: new Date().toISOString()
  };
  
  // Create mock token
  const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
  
  // Store the mock user in localStorage
  localStorage.setItem('mock_user', JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('auth_token', token);
  
  return { user, token };
};

/**
 * Check if a user is signed in
 */
export const isUserSignedIn = () => {
  return !!localStorage.getItem('auth_token') && !!localStorage.getItem('user');
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('mock_user');
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
};
