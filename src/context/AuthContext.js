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
  const [points, setPoints] = useState(0);
  // const [assigned, setAssigned] = useState(0);
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
      // setAssigned(await getAssignedCourses(email));
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
  }, [toast, history, email]);

  useEffect(() => {
    if (token) {
      // console.log("Definitely Logged In");
      fetchAll().then(() => {
        // console.log(points);
      });
    }

  }, [points, fetchAll, token]);


  const getAssignedCourses = async () => {

    const temp = await api.post('/admin/getAssignedCourses');
    console.log(temp.data);
    // setCourses(temp.data);
      
      return temp.data;
  };

  const addEarnedPoints = async (results) => {
    console.log(results);
    let correct = 0;
    let numQ = results.length;
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      
      if (results[i].pointsEarned > 0) {
        total = total + results[i].pointsEarned;
        correct = correct + 1;
      }
    }

    let calc = correct/numQ;
    console.log(calc);

    if (calc > 0.4 && calc <= 0.6) {
      // If 40% - 50% correct, earn 0 points
      total = 0;

    } else if (calc <= 0.4) {
      // If 0 - 40% correct, deduct 1000 points per wrong.
      total = (numQ - correct) * -1000;

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
    // clearPoints();
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
