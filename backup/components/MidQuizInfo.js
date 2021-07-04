import { Box, Heading, Text } from '@chakra-ui/react';
import React, {
  useEffect,
  useState,
} from 'react';

import Countdown from './Countdown';
import QuizStatusType from '../types/QuizStatusType';
import GameAdminQuestion from './GameAdminQuestion';

function MidQuizInfo({ status }) {
  const question = status.questions[status.position];
  const [timeLeft, setTimeLeft] = useState(question?.duration || 1);
  const [endTime, setEndTime] = useState(Date.now());

  useEffect(() => {
    if (question?.duration) {
      const date = new Date(
        +new Date(status.isoTimeLastQuestionStarted) + question.duration * 1000,
      );
      setEndTime(date);
    }
  }, [question, status.isoTimeLastQuestionStarted]);

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
      <Box py={4}>
        <Heading as="p" textAlign="center" fontSize="xl">Time Left</Heading>
        <Countdown timeLeft={timeLeft} />
      </Box>
      <Box>
        <Text fontFamily="heading" size="md">
          Question
          {' '}
          {status.position + 1}
        </Text>
        <GameAdminQuestion question={question} showCorrect={status.answerAvailable} />
      </Box>
    </>
  );
}

MidQuizInfo.propTypes = {
  status: QuizStatusType.isRequired,
};

export default MidQuizInfo;
