import React from 'react';
import { Redirect } from 'react-router';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { token } = useAuth();
  if (token) {
    return <Redirect to="/admin" />;
  }
  return <Redirect to="/login" />;
}

export default HomePage;
