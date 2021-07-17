import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/react';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [token, setToken, clearToken] = useLocalStorage('token', '');
  const [role, setRole, clearRole] = useLocalStorage('role', '');
  const [name, setName, clearName] = useLocalStorage('name', '');
  const [points, setPoints, clearPoints] = useState(0);
  const [email, setEmail, clearEmail] = useLocalStorage('email', '');
  const history = useHistory();
  const toast = useToast();

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

  const fetchAll = useCallback(async () => {
    try {
      setPoints(await getCurrentPoints(email));
    } catch (err) {
      if (err.response?.status === 403) {
        toast({
          title: 'Not logged in',
          description: 'You need to be logged in to retrieve points ',
          status: 'error',
          isClosable: true,
          position: 'top',
        });
        history.replace('/login');
      }
    }
  }, [toast, history]);

  useEffect(() => {
    // console.log('Do something after points has changed in AuthContext', points);

    if (token) {
      console.log("Definitely Logged In");
      fetchAll().then(() => {
        console.log(points);
      });
    }

  }, [points]);

  const addEarnedPoints = async (results) => {
    console.log(results);
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      total = total + results[i].pointsEarned;
    }
    const res = await api.post('/admin/auth/addPoints', { email, total });
    // console.log(res);
    setPoints(res.data.points);

  };

  const addPoints = async (total) => {
    console.log(total);
    total = 1000;
    const response = await api.post('/admin/auth/addPoints', { email, total });
    console.log(response);
    setPoints(response.data.points);

  };
  const getCurrentPoints = async (email) => {
    const res = await api.post('/admin/auth/checkPoints', { email });
    setPoints(res.data.curr);
    console.log(res);
    return res.data.curr;
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
      token, login, register, logout, role, setRole, name, points, addEarnedPoints, getCurrentPoints, addPoints, email
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
