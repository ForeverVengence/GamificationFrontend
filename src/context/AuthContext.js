import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [token, setToken, clearToken] = useLocalStorage('token', '');
  const [role, setRole, clearRole] = useLocalStorage('role', '');
  const history = useHistory();

  const login = async (email, password) => {
    const res = await api.post('/admin/auth/login', { email, password });
    console.log(res);
    setToken(res.data.token);
    setRole('Student');
  };

  const register = async (email, password, username, permission) => {
    const payload = {
      email, password, username, permission,
    };
    const res = await api.post('/admin/auth/register', payload);
    // console.log(res);
    setToken(res.data.token);
    setRole(res.data.role);
  };

  const logout = async () => {
    clearToken();
    clearRole();
    history.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      token, login, register, logout, role, setRole,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
