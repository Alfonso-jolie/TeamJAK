import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword,
  onAuthStateChange,
  getCurrentUserData,
  updateUserPassword
} from '../firebase/auth';

// Session management utilities
const SESSION_KEY = 'currentUser';
const USERS_KEY = 'users'; // Fallback for demo purposes

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const result = await registerUser(userData.email, userData.password, userData);
      
      if (result.success) {
        // Store session data
        const sessionData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          studentNumber: userData.studentNumber,
          idCardNumber: userData.idCardNumber,
          role: 'student',
          loggedInAt: new Date().toISOString(),
        };
        
        this.setSession(sessionData);
        return { success: true, user: sessionData };
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        const sessionData = {
          ...result.user,
          loggedInAt: new Date().toISOString(),
        };
        
        this.setSession(sessionData);
        return { success: true, user: sessionData };
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      const result = await logoutUser();
      
      if (result.success) {
        this.clearSession();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    return await resetPassword(email);
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const result = await updateUserPassword(newPassword);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user from session
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(SESSION_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser();
    return user !== null;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Set session data
  setSession(userData) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting session:', error);
    }
  }

  // Clear session data
  clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Listen to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChange(callback);
  }

  // Demo methods for localStorage fallback (to be removed when Firebase is fully integrated)
  
  // Register user using localStorage (demo only)
  async registerDemo(userData) {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      const users = stored ? JSON.parse(stored) : [];

      // Check for duplicates
      const duplicate = users.find((u) =>
        u.email?.toLowerCase() === userData.email.trim().toLowerCase() ||
        u.studentNumber === userData.studentNumber.trim() ||
        u.idCardNumber === userData.idCardNumber.trim()
      );
      
      if (duplicate) {
        return {
          success: false,
          error: 'User already exists',
          duplicateFields: {
            email: duplicate.email?.toLowerCase() === userData.email.trim().toLowerCase(),
            studentNumber: duplicate.studentNumber === userData.studentNumber.trim(),
            idCardNumber: duplicate.idCardNumber === userData.idCardNumber.trim()
          }
        };
      }

      // Create new user
      const newUser = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim(),
        password: userData.password, // Note: In production, never store plaintext passwords
        idCardNumber: userData.idCardNumber.trim(),
        studentNumber: userData.studentNumber.trim(),
        role: 'student',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user using localStorage (demo only)
  async loginDemo(identifier, password) {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      const users = stored ? JSON.parse(stored) : [];
      
      // Try to find user by email or student number
      const user = users.find((u) => 
        u.email === identifier || u.studentNumber === identifier
      );

      if (!user || user.password !== password) {
        return {
          success: false,
          error: user ? 'Incorrect password' : 'User not found'
        };
      }

      // Store session in localStorage
      const sessionData = {
        email: user.email,
        studentNumber: user.studentNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'student',
        loggedInAt: new Date().toISOString(),
      };

      this.setSession(sessionData);
      return { success: true, user: sessionData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;
