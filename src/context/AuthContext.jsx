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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      let finalUser;
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        finalUser = {
          id: fbUser.uid,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || 'user'
        };
      } else {
        // Fallback if missing
        finalUser = {
          id: fbUser.uid,
          email: fbUser.email,
          firstName: 'User',
          lastName: '',
          role: 'user'
        };
      }

      localStorage.setItem('dripyard_token', await fbUser.getIdToken());
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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const fbUser = userCredential.user;
      
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'user',
        uid: fbUser.uid,
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', fbUser.uid), userData);
      
      const finalUser = {
        id: fbUser.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user'
      };

      localStorage.setItem('dripyard_token', await fbUser.getIdToken());
      localStorage.setItem('dripyard_current_user', JSON.stringify(finalUser));
      setUser(finalUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
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
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      let finalUser;
      if (!userDoc.exists()) {
        const nameParts = fbUser.displayName ? fbUser.displayName.split(' ') : ['Google', 'User'];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        const userData = {
          firstName,
          lastName,
          email: fbUser.email,
          role: 'user',
          uid: fbUser.uid,
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, userData);
        
        finalUser = {
          id: fbUser.uid,
          email: fbUser.email,
          firstName,
          lastName,
          role: 'user'
        };
      } else {
        const data = userDoc.data();
        finalUser = {
          id: fbUser.uid,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || 'user'
        };
      }

      localStorage.setItem('dripyard_token', await fbUser.getIdToken());
      localStorage.setItem('dripyard_current_user', JSON.stringify(finalUser));
      setUser(finalUser);
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, forgotPassword, loginWithGoogle, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
