import {
  Box, Flex,
} from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import QuizResultCard from './QuizResultCard';

function QuizResultPodium({ topPlayers }) {
  const [p1, p2, p3, p4, p5] = topPlayers;
  return (
    <Box>
      <Flex justify="center">
        <QuizResultCard isWinner position="1st" result={p1} />
      </Flex>
      {p2 && (
        <Flex justify="space-evenly" mt={4} w="80%" mx="auto">
          <QuizResultCard position="2nd" result={p2} />
          {p3 && <QuizResultCard position="3rd" result={p3} />}
        </Flex>
      )}
      {p4 && (
        <Flex justify="space-evenly" mt={4} w="80%" mx="auto">
          <QuizResultCard position="4th" result={p4} />
          {p5 && <QuizResultCard position="4th" result={p5} />}
        </Flex>
      )}
    </Box>
  );
}

QuizResultPodium.propTypes = {
  topPlayers: PropTypes.arrayOf(
    PropTypes.shape({
      player: PropTypes.string,
      points: PropTypes.number,
      nCorrect: PropTypes.number,
    }),
  ).isRequired,
};

export default QuizResultPodium;
