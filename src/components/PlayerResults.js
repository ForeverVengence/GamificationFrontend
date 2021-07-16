/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box, Button, Heading, Stack, Text,
} from '@chakra-ui/react';
import Container from './Container';
import { useAuth } from '../context/AuthContext';


function PlayerResults({ results }) {

  const [points, setPoints] = useState(null);
  const { addEarnedPoints } = useAuth();
  

  // const addPointsNow = async (points) => {
  //   const res = await addPoints(points);
  //   return res;
  // }

  useEffect(() => {
    console.log("Hello World");
    console.log(results);
    let total = 0;
    const res = addEarnedPoints(results);
    for (let i = 0; i < results.length; i++) {
      total = total + results[i].pointsEarned;
    }
    setPoints(total);

  }, [setPoints]);
  

  return (
    <Container>
      <Heading as="h1" mb={6}>Results</Heading>
      <Stack spacing={4}>
        {results.map((r, i) => (
          <Box>
            <Heading as="h2" size="lg">
              Question 
              {' ' + (i + 1)}
            </Heading>
            <Text>
              Your answer was
              {' '}
              {r.correct ? 'correct!' : 'wrong ☹'}
            </Text>
          </Box>
        ))}
        <Heading>You Earned {points} points!</Heading>
        <Button
          as={Link}
          to={`/student`}
          variant="outline"
          colorScheme="blue"
        >
          Return Home
        </Button>
      </Stack>
    </Container>
  );
}

PlayerResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          answerIds: PropTypes.arrayOf(PropTypes.number),
          correct: PropTypes.bool.isRequired,
          questionStartedAt: PropTypes.string,
          answeredAt: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
};

export default PlayerResults;
