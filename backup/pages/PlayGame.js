/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useSessions } from '../context/SessionContext';
import GamePlayerQuestion from '../components/GamePlayerQuestion';
import PlayerResults from '../components/PlayerResults';
// import Countdown from 'react-countdown';
// import api from '../api';
// import URLMediaPreview from '../components/URLMediaPreview';

function PlayGame() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [results, setResults] = useState(null);
  const { session } = useParams();
  const {
    getQuestion,
    getAnswer,
    putAnswer,
    getResults,
  } = useSessions();
  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const q = await getQuestion(session);
        setQuestion((old) => {
          if (old?.id === q.id) {
            return old;
          }
          // Reset answers
          setAnswer(null);
          return q;
        });
      } catch (err) {
        const msg = err?.response?.data?.error;
        if (msg === 'Session has not started yet') {
          setQuestion(null);
        } else if (msg === 'Session ID is not an active session') {
          setQuestion(null);
          clearInterval(interval);
          try {
            const res = await getResults(session);
            setResults(res);
          } catch (err2) {
            const msg2 = err2?.response?.data?.error;
            // if (msg2) {
            //   toast({
            //     status: 'error',
            //     title: 'Error',
            //     description: msg,
            //     isClosable: true,
            //     duration: 5000,
            //   });
            // }
          }
        }
      }

      try {
        const ans = await getAnswer(session);
        setAnswer((old) => (old === null ? ans : old));
      } catch (err) {
        const msg = err?.response?.data?.error;
        if (msg && msg !== "Question time has not been completed") {
          console.log(msg);
          // toast({
          //   status: 'error',
          //   title: 'Error',
          //   description: msg,
          //   isClosable: true,
          //   duration: 5000,
          // });
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [session, getQuestion, getAnswer, getResults, toast]);

  const handleAnswerChange = (answers) => {
    putAnswer(session, answers);
  };

  return (
    <Box flexGrow={1}>
      <Box>
        {!question && !results && <Heading textAlign="center" mt="20vh" as="h1">Waiting for Game to Start</Heading>}
        {question && (
          <GamePlayerQuestion
            question={question}
            correctAnswers={answer}
            onAnswerChange={handleAnswerChange}
          />
        )}
        {!question && results && (
          <PlayerResults results={results} />
        )}
      </Box>
    </Box>
  );
}

export default PlayGame;
