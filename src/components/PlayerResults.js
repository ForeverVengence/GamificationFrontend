/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box, Button, Heading, Stack, Text,
} from '@chakra-ui/react';
import Container from './Container';
import { useAuth } from '../context/AuthContext';
import Space from '../components/Space';


function PlayerResults({ results }) {

  const [points, setPoints] = useState(null);
  const { addEarnedPoints } = useAuth();
  

  // const addPointsNow = async (points) => {
  //   const res = await addPoints(points);
  //   return res;
  // }

  useEffect(() => {
    console.log(results);
    let total = 0;
    let correct = 0;
    let numQ = results.length;
    const res = addEarnedPoints(results);
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
      setPoints(0);

    } else if (calc <= 0.4) {
      // If 0 - 40% correct, deduct 1000 points per wrong.
      setPoints((numQ - correct) * -1000);

    } else {
      console.log("else")
      setPoints(total);
    }

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
              {r.correct ? 'correct! ✔️' : 'wrong 😔'}
            </Text>
          </Box>
        ))}
        <Space h={3} />
        {points > 0 && (<Heading>Sweet As! 💪💪💪 You Earned {points} points!</Heading>)}
        {points < 0 && (
          <>
            <Heading>You did not achieve more than 40% correct!</Heading>
            <Heading>The penalty applied: {points} Points.</Heading>
            <Heading>Please Try Again!</Heading>
          </>
        )}
        {points == 0 && (
          <>
            <Heading>You achieved 40% - 60% of Questions correct!</Heading>
            <Heading>You did not pass this level.</Heading>
            <Heading>0 Points Earned. Please Try Again!</Heading>
          </>
          
        )}
        
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
