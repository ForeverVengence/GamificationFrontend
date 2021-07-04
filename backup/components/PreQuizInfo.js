import {
  Box,
  Flex,
  Grid,
  Heading,
  Tag,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import { AnimateSharedLayout, motion } from 'framer-motion';

import QuizStatusType from '../types/QuizStatusType';

const NAME_TO_COLOR = {};
const COLORS = ['green', 'blue', 'yellow', 'red', 'orange', 'teal', 'cyan', 'purple', 'pink'];

function randomColor(name) {
  if (NAME_TO_COLOR[name]) return NAME_TO_COLOR[name];

  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function PreQuizInfo({ status, sessionId }) {
  return (
    <>
      <Heading as="h1" mt={8} mb={6}>Waiting to start...</Heading>
      <Grid>
        <Box textAlign="center" mb={4}>
          <Heading as="h2" fontSize="xl" fontWeight="normal">Session Code</Heading>
          <Text as="p" fontSize="6rem" fontWeight="bold" fontFamily="heading">{sessionId}</Text>
          <Heading as="h2" fontSize="xl">
            Players
            {status.players?.length ? ` - ${status.players.length} joined` : null}
          </Heading>

          <AnimateSharedLayout>
            <Flex
              flexWrap="wrap"
              justify="center"
              textAlign="center"
              my={4}
            >
              {status.players?.length ? Object.entries(status.players).map(([i, player]) => (
                <motion.span layout>
                  <Tag
                    key={player + i}
                    mb={4}
                    mr={4}
                    colorScheme={randomColor(player)}
                    variant="subtle"
                    size="lg"
                  >
                    {player}
                  </Tag>
                </motion.span>
              )) : <Text>No players have joined yet ☹</Text>}
            </Flex>
          </AnimateSharedLayout>
        </Box>
      </Grid>
    </>
  );
}

PreQuizInfo.propTypes = {
  status: QuizStatusType.isRequired,
  sessionId: PropTypes.string,
};

PreQuizInfo.defaultProps = {
  sessionId: '',
};

export default PreQuizInfo;
