/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SimpleGrid, Heading, Text, Box, Button, VisuallyHiddenInput,
} from '@chakra-ui/react';
import QuestionType from '../types/QuestionType';
import Container from './Container';
import URLMediaPreview from './URLMediaPreview';
import Countdown from './Countdown';
import Space from './Space';
import { useQuizzes } from '../context/QuizContext';

const cols = {
  start: 'gray', correct: 'green', wrong: 'red', selected: 'teal',
};

const compare = (a, b) => JSON.stringify(a.sort()) === JSON.stringify(b.sort());

function GamePlayerQuestion({ question: _question, correctAnswers, session, onAnswerChange = () => {} }) {
  const {
    id,
    question,
    media,
    answers,
    type,
    duration,
    isoTimeLastQuestionStarted,
  } = _question;

  const { advanceSession } = useQuizzes();

  const inputType = type === 'single' ? 'radio' : 'checkbox';

  const [timeLeft, setTimeLeft] = useState(duration || 1);
  const [endTime, setEndTime] = useState(Date.now());

  const [selected, setSelected] = useState([]);

  const isCorrect = correctAnswers && compare(selected, correctAnswers);

  useEffect(() => {
    onAnswerChange(selected);
  }, [onAnswerChange, selected]);

  useEffect(() => {
    setSelected([]);
  }, [id]);

  const handleClick = (i) => () => {
    if (correctAnswers) return;

    if (type === 'single') {
      setSelected([i]);
    } else {
      setSelected((old) => {
        if (old.includes(i)) {
          return old.filter((e) => e !== i);
        }
        return [...old, i];
      });
    }
  };

  const handleNext = useCallback(async () => {
    console.log("move to next question");
    console.log(session);
    const res = await advanceSession(session);
    console.log(res);
  }, []);

  useEffect(() => {
    if (duration) {
      const date = new Date(
        +new Date(isoTimeLastQuestionStarted) + duration * 1000,
      );
      setEndTime(date);
    }
  }, [duration, isoTimeLastQuestionStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(() => {
        const res = Math.floor((endTime - new Date()) / 1000);
        if (res <= 0) {
          clearInterval(interval);
        }
        return res;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [endTime]);

  return (
    <>
      <Container>
        <Text fontFamily="heading" size="md">Question</Text>
        <Heading fontStyle="italic" as="h2" size="lg" mb={4}>
          {question}
        </Heading>
        {correctAnswers ? (
          <>
            <Text>
              Your answer was
              {' '}
              <Text as="b" color={isCorrect ? 'green.500' : 'red.500'}>{isCorrect ? 'correct!' : 'wrong ???!'}</Text>
            </Text>
          </>
        ) : (
          <>
            <Text textAlign="center">
              Time left:
              {' '}
            </Text>
            <Countdown timeLeft={timeLeft} size="4rem" />
          </>
        )}
        {media && <URLMediaPreview type={media.type} url={media.src} />}
      </Container>
      <SimpleGrid mx="auto" maxWidth="container.xl" columns={{ base: 1, sm: 2 }} spacing={4} padding={4}>
        {answers.map((ans, i) => {
          let col = cols.start;

          if (correctAnswers) {
            if (correctAnswers.includes(+i)) {
              col = cols.correct;
            } else {
              col = cols.wrong;
            }
          } else if (selected.includes(i)) {
            col = cols.selected;
          }

          return (
            <Box>
              {!correctAnswers && (
              <>
                <VisuallyHiddenInput
                  checked={selected.includes(i)}
                  id={ans}
                  value={ans}
                  type={inputType}
                />
              </>
              )}
              <Box
                as="label"
                htmlFor={correctAnswers ? '' : ans}
                maxWidth={{ base: '100%' }}
              >
                <Button
                  width="100%"
                  height="100%"
                  fontSize="xl"
                  padding={4}
                  colorScheme={col}
                  transition="all 250ms ease-in-out"
                  wordBreak="break-all"
                  wordWrap="break-word"
                  onClick={handleClick(i)}
                >
                  {ans}
                </Button>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>
      <Space h="6"/>
      {correctAnswers ? (
        <SimpleGrid mx="auto" maxWidth="container.xl" columns={{ base: 1, sm: 1 }} spacing={4} padding={4}>
          <Button
            width="100%"
            height="100%"
            fontSize="xl"
            padding={4}
            colorScheme="orange"
            transition="all 250ms ease-in-out"
            wordBreak="break-all"
            wordWrap="break-word"
            onClick={handleNext}
          >
          Next Question
          </Button>
        </SimpleGrid>
      ) : (
        null
      )}
    </>
  );
}

GamePlayerQuestion.propTypes = {
  question: QuestionType.isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.number),
  onAnswerChange: PropTypes.func,
};

GamePlayerQuestion.defaultProps = {
  correctAnswers: null,
  onAnswerChange: () => {},
};

export default GamePlayerQuestion;
