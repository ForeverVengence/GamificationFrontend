import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [token, setToken, clearToken] = useLocalStorage('token', '');
  const [role, setRole, clearRole] = useLocalStorage('role', '');
  const [name, setName, clearName] = useLocalStorage('name', '');
  const [points, setPoints, clearPoints] = useLocalStorage('points', '');
  const [email, setEmail, clearEmail] = useLocalStorage('email', '');
  const history = useHistory();

  const login = async (email, password) => {
    const res = await api.post('/admin/auth/login', { email, password });
    console.log(res);
    setToken(res.data.token);
    setRole(res.data.role);
    setName(res.data.username);
    setPoints(res.data.points);
    setEmail(email);
    return res.data;
  };

  const addEarnedPoints = async (results) => {
    console.log(results);
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      total = total + results[i].pointsEarned;
    }
    const res = await api.post('/admin/auth/addPoints', { email, total });
    console.log(res);
    setPoints(res.data.points);
  };
  const getCurrentPoints = async (email) => {
    const res = await api.post('/admin/auth/checkPoints', { email });
    setPoints(res.data.curr);
    console.log(res);
    return res;
  };

  const register = async (email, password, username, permission) => {
    const payload = {
      email, password, username, permission,
    };
    console.log(payload);
    const res = await api.post('/admin/auth/register', payload);
    // console.log(res);
    setToken(res.data.token);
    setRole(res.data.role);
    setName(username);
    setPoints(0);
    setEmail(email);
  };

  const logout = async () => {
    clearToken();
    clearRole();
    clearName();
    clearPoints();
    clearEmail();
    history.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      token, login, register, logout, role, setRole, name, points, addEarnedPoints, getCurrentPoints, email
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
