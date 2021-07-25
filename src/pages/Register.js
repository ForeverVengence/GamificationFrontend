import React, { useState } from 'react';
import {
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  FormErrorMessage,
  Stack,
  FormErrorIcon,
  RadioGroup,
  Radio,
  HStack,
  FormHelperText,
} from '@chakra-ui/react';
import {
  Link as RouterLink, useHistory,
} from 'react-router-dom';
import Container from '../components/Container';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';

function Register() {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pass, setPass] = useState('');
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('');
  const { register } = useAuth();
  const history = useHistory();
  useTitle('Register');

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (permission === '') {
      // eslint-disable-next-line no-alert
      alert('Permission Required');
    } else {
      try {
        await register(email, pass, username, permission);
        if (permission === "Staff") {
          history.push('/admin');
        } else {
          history.push('/student');
        }
        
      } catch (err) {
        const msg = err?.response?.data?.error;
        if (err.isAxiosError && msg) {
          if (msg.includes('Email')) {
            setEmailErr(msg);
          }
        }
      }
    }
  };

  return (
    <Container>
      <Heading mb={6} as="h1">Register</Heading>
      <Stack as="form" spacing={6} onSubmit={handleSubmit}>
        <FormControl isRequired isInvalid={!!emailErr}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormErrorMessage>
            <FormErrorIcon />
            {emailErr}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel as="legend">Platform Permissions</FormLabel>
          <RadioGroup defaultValue="Itachi" value={permission} onChange={setPermission}>
            <HStack spacing="24px">
              <Radio value="Student">Student</Radio>
              <Radio value="Staff">Staff</Radio>
            </HStack>
          </RadioGroup>
          <FormHelperText>Select permissions for Platform</FormHelperText>
        </FormControl>
        <Flex align="center" justify="space-between">
          <Link as={RouterLink} to="/register">Already have an account? Login Here!</Link>
          <Button colorScheme="green" type="submit" value="Submit" aria-label="Register">
            Register
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}

export default Register;
