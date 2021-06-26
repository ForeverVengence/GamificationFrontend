import React, { useState } from 'react';
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  FormErrorMessage,
  FormErrorIcon,
} from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import Container from '../components/Container';
import { useSessions } from '../context/SessionContext';
import useLocalStorage from '../hooks/useLocalStorage';

function JoinGame() {
  const [name, setName] = useLocalStorage('playerName', '');
  const history = useHistory();
  const { session } = useParams();
  const { join } = useSessions();

  const [sessionId, setSessionId] = useState(session ?? '');
  const [sessionError, setSessionError] = useState('');

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await join(sessionId, name);
      history.push(`/game/play/${sessionId}`);
    } catch (err) {
      if (err.response?.data?.error) {
        setSessionError(err.response?.data?.error);
      }
    }
  };

  return (
    <Container>
      <Heading mt={6} mb={4} as="h1" flexGrow="1">
        Join a Game
      </Heading>
      <Stack spacing={4} as="form" onSubmit={handleSubmit}>
        <FormControl isInvalid={!!sessionError}>
          <FormLabel>Session ID</FormLabel>
          <Input onChange={(e) => setSessionId(e.target.value)} value={sessionId} />
          <FormErrorMessage>
            <FormErrorIcon />
            {sessionError}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={6}>
          <FormLabel>Enter Your Name</FormLabel>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} isRequired />
        </FormControl>
        <Button ml="auto" alignSelf="flex-end" colorScheme="green" type="submit">
          Join Game
        </Button>
      </Stack>
    </Container>
  );
}

export default JoinGame;
