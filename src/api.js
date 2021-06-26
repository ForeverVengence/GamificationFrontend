import axios from 'axios';
import { createStandaloneToast } from '@chakra-ui/react';
import config from './config.json';

const PORT = config.BACKEND_PORT;
const toast = createStandaloneToast();

const api = axios.create({
  // baseURL: `http://p1.rasonchia.space:${PORT}`,
  baseURL: `http://localhost:${PORT}`,
});

api.interceptors.request.use((req) => {
  if (!req.headers.Authorization) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`;
  }
  return req;
});
api.interceptors.response.use((res) => res, (err) => {
  if (err.toJSON().message === 'Network Error') {
    toast({
      title: 'Network Error',
      position: 'top',
      description: "We're having trouble connecting to our servers. Try checking your internet connection or try again later.",
      status: 'error',
      isClosable: true,
      duration: 10000,
    });
  }
  throw err;
});

window.api = api;

export default api;
