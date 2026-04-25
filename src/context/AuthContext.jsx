import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from '../config/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // On mount, check if token and user exist
    const token = localStorage.getItem('dripyard_token');
    const savedUser = localStorage.getItem('dripyard_current_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('dripyard_token');
        localStorage.removeItem('dripyard_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Call backend login endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const finalUser = data.user;
      
      // Also sign in on the frontend with the token if we want to keep the Firebase session
      // For now, we'll just store information locally as before.
      localStorage.setItem('dripyard_token', data.token);
      localStorage.setItem('dripyard_current_user', JSON.stringify(finalUser));
      setUser(finalUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message }; 
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
    } catch(e) {}
    localStorage.removeItem('dripyard_token');
    localStorage.removeItem('dripyard_current_user');
    setUser(null);
  };

  const register = async (data) => {
    try {
      // 1. Create user in Firebase Auth (Frontend)
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();
      
      // 2. Sync with backend (which creates the Firestore document with Admin privileges)
      // Note: We use the register endpoint or a new sync endpoint.
      // Since the user is already created in Auth, we can just call our backend to create the doc.
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: fbUser.uid, // Backend should handle if user already exists in Auth
          email: data.email,
          password: data.password, // Backend needs this for its own createUser call if we use the existing register endpoint
          firstName: data.firstName,
          lastName: data.lastName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sync user with backend');
      }

      const backendData = await response.json();
      const finalUser = {
        id: fbUser.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user'
      };

      localStorage.setItem('dripyard_token', idToken);
      localStorage.setItem('dripyard_current_user', JSON.stringify(finalUser));
      setUser(finalUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      // If it's the "Email already exists" from backend after frontend success, we can try to recover
      return { success: false, message: error.message }; 
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: error.message };
    }
  };

  const loginWithGoogle = async () => {

    const provider = new GoogleAuthProvider();
    try {
      // 1. Sign in with Google (Frontend)
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();
      
      // 2. Call backend to verify and ensure user exists in Firestore (Admin privileges)
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Backend Google Authentication failed');
      }

      const backendData = await response.json();
      const finalUser = backendData.user;

      localStorage.setItem('dripyard_token', token);
      localStorage.setItem('dripyard_current_user', JSON.stringify(finalUser));
      setUser(finalUser);
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, forgotPassword, loginWithGoogle, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
