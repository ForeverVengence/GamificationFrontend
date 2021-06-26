import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, useColorMode } from '@chakra-ui/react';

const cardBg = { light: 'gray.200', dark: 'gray.700' };

function QuizResultCard({ result: { player, points, nCorrect }, position }) {
  const { colorMode } = useColorMode();
  return (
    <Box
      borderRadius="md"
      p={4}
      backgroundColor={cardBg[colorMode]}
      textAlign="center"
    >
      <Text fontSize="xl" fontWeight="bold">
        {position}
      </Text>
      <Text textAlign="center" fontSize="lg">
        {player}
      </Text>
      <Text fontSize="md">
        {points}
        {' '}
        Points
      </Text>
      <Text fontSize="md">
        {nCorrect}
        {' '}
        Correct
      </Text>
    </Box>
  );
}

QuizResultCard.propTypes = {
  result: PropTypes.shape({
    player: PropTypes.string,
    points: PropTypes.number,
    nCorrect: PropTypes.number,
  }).isRequired,
  position: PropTypes.string.isRequired,
};

export default QuizResultCard;
