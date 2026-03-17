import { createContext, useContext, useState, useEffect } from "react";
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // On mount, check if token and user exist
    const token = localStorage.getItem('dripyard_token');
    const savedUser = localStorage.getItem('dripyard_current_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('dripyard_token', data.token);
      localStorage.setItem('dripyard_current_user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      // In a real app we'd throw this to show to the user, 
      // but returning false to keep existing component logic working
      return false; 
    }
  };

  const logout = () => {
    localStorage.removeItem('dripyard_token');
    localStorage.removeItem('dripyard_current_user');
    setUser(null);
  };

  const register = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
         throw new Error(responseData.message || 'Registration failed');
      }

      localStorage.setItem('dripyard_token', responseData.token);
      localStorage.setItem('dripyard_current_user', JSON.stringify(responseData.user));
      setUser(responseData.user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: error.message };
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Google Login failed');
      }

      localStorage.setItem('dripyard_token', data.token);
      localStorage.setItem('dripyard_current_user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, forgotPassword, loginWithGoogle, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
