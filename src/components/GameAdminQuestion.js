import {
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import QuestionType from '../types/QuestionType';
import URLMediaPreview from './URLMediaPreview';

const lightCols = { start: 'blue.200', correct: 'green.200', wrong: 'red.200' };
const darkCols = { start: 'blue.500', correct: 'green.500', wrong: 'red.500' };

const GameAdminQuestion = React.memo(
  ({ question: _question, showCorrect = false }) => {
    const {
      question, media, type, answers, correctAnswers,
    } = _question;

    const cols = useColorModeValue(lightCols, darkCols);
    return (
      <>
        <Heading fontStyle="italic" as="h2" size="lg" mb={2}>
          {question}
        </Heading>
        {media ? <URLMediaPreview type={media.type} url={media.src} /> : null}
        <Heading as="h2" size="lg" mt={4}>
          Answer Options
        </Heading>
        <Text fontSize="md">
          {type === 'single'
            ? 'Choose the best answer'
            : 'Choose all answers that apply'}
        </Text>
        <Stack spacing={4} mt={4}>
          {Object.entries(answers).map(([i, ans]) => {
            let bg = cols.start;

            if (showCorrect) {
              if (correctAnswers.includes(+i)) {
                bg = cols.correct;
              } else {
                bg = cols.wrong;
              }
            }

            return (
              <Box
                key={ans}
                fontSize="2xl"
                padding={4}
                bg={bg}
                transition="all 250ms ease-in-out"
              >
                {ans}
              </Box>
            );
          })}
        </Stack>
      </>
    );
  },
);

GameAdminQuestion.propTypes = {
  question: QuestionType.isRequired,
  showCorrect: PropTypes.bool,
};

GameAdminQuestion.defaultProps = {
  showCorrect: false,
};

export default GameAdminQuestion;
