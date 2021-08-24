import React, { useState } from 'react';
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Flex,
  FormErrorMessage,
  FormErrorIcon,
} from '@chakra-ui/react';
import {
  Link as RouterLink, useHistory,
} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from '../components/Container';
import useTitle from '../hooks/useTitle';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const { login } = useAuth();

  useTitle('Login');

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const data = await login(email, pass);
      if (data.role === 'Staff') {
        history.push('/admin');
      } else {
        history.push('/student');
      }
      
    } catch (err) {
      setPass('');
      if (err.isAxiosError) {
        setError(err.response.data.error);
      }
    }
  };

  return (
    <Container>
      <Heading mb={6} as="h1">Admin Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={6} isRequired>
          <FormLabel>Email</FormLabel>
          <Input name="email" alt="Login Email" data-testid="emailinput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input name="password" alt="Login Password" data-testid="passwordinput" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </FormControl>
        <FormControl isInvalid={!!error}>
          <FormErrorMessage my={2}>
            <FormErrorIcon />
            {error}
          </FormErrorMessage>
        </FormControl>
        <Flex mt={6} align="center" justify="space-between">
          <Link as={RouterLink} to="/register">Don&apos;t have an account? Register Here!</Link>
          <Button colorScheme="green" type="submit" value="Submit" aria-label="Login">
            Sign In
          </Button>
        </Flex>
      </form>
    </Container>
  );
}

export default Login;
