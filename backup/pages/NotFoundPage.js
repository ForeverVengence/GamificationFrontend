import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Stack } from '@chakra-ui/react';
import useTitle from '../hooks/useTitle';
import Container from '../components/Container';

function NotFoundPage() {
  // TODO: Make better
  useTitle('404 Not Found');
  return (
    <Container>
      <Stack spacing={4}>
        <Button as={Link} to="/login">Login</Button>
        <Button as={Link} to="/register">Register</Button>
        <Button as={Link} to="/admin">Dashboard</Button>
        <Button as={Link} to="/game/join">Play game</Button>
      </Stack>
    </Container>
  );
}

export default NotFoundPage;
