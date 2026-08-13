// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';

// const AuthContext = createContext();

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const userData = await api.getCurrentUser();
//           setUser(userData);
//         } catch (err) {
//           console.error('Failed to load user:', err);
//           localStorage.removeItem('token');
//         }
//       }
//       setLoading(false);
//     };

//     loadUser();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       const data = await api.login(email, password);
//       setUser(data.user);
//       return { success: true };
//     } catch (err) {
//       setError(err.message || 'Login failed');
//       return { success: false, error: err.message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setError(null);
//       const data = await api.register(userData);
//       // Auto-login after registration
//       const loginResult = await login(userData.email, userData.password);
//       return loginResult;
//     } catch (err) {
//       setError(err.message || 'Registration failed');
//       return { success: false, error: err.message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refresh_token');
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }




// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {  // ✅ Accept email
    const data = await api.login(email, password);
    setUser(data.user);
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

