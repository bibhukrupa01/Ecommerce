import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Seed default users if none exist
    const savedUsers = localStorage.getItem('dripyard_users');
    if (!savedUsers) {
      const initialUsers = [
        { id: 1, email: 'admin@dripyard.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin' },
        { id: 2, email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe', role: 'user' }
      ];
      localStorage.setItem('dripyard_users', JSON.stringify(initialUsers));
    }

    // On mount, read from localStorage
    const savedUser = localStorage.getItem('dripyard_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('dripyard_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      localStorage.setItem('dripyard_loggedin', 'true');
      localStorage.setItem('dripyard_current_user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('dripyard_loggedin');
    localStorage.removeItem('dripyard_current_user');
    setUser(null);
  };

  const register = (data) => {
    const users = JSON.parse(localStorage.getItem('dripyard_users') || '[]');
    const exists = users.find(u => u.email === data.email);
    if (exists) return false;
    
    const newUser = { 
      id: Date.now(), 
      ...data, 
      role: 'user', 
      joined: new Date().toISOString().split('T')[0] 
    };
    
    users.push(newUser);
    localStorage.setItem('dripyard_users', JSON.stringify(users));
    localStorage.setItem('dripyard_loggedin', 'true');
    localStorage.setItem('dripyard_current_user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
