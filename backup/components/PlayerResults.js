import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Heading, Stack, Text,
} from '@chakra-ui/react';
import Container from './Container';

function PlayerResults({ results }) {
  return (
    <Container>
      <Heading as="h1" mb={6}>Results</Heading>
      <Stack spacing={4}>
        {results.map((r, i) => (
          <Box>
            <Heading as="h2" size="lg">
              Question
              {i + 1}
            </Heading>
            <Text>
              Your answer was
              {' '}
              {r.correct ? 'correct!' : 'wrong ☹'}
            </Text>
          </Box>
        ))}
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
