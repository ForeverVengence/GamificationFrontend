/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  useToast,
  Button,
  Center,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useSessions } from '../context/SessionContext';
import GamePlayerQuestion from '../components/GamePlayerQuestion';
import PlayerResults from '../components/PlayerResults';
import Space from '../components/Space';
import { QuizContextProvider, useQuizzes } from '../context/QuizContext';
import { AuthContextProvider, useAuth } from '../context/AuthContext';
// import Countdown from 'react-countdown';
// import api from '../api';
// import URLMediaPreview from '../components/URLMediaPreview';

function PlayGame() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [isLevel, setIsLevel] = useState(false);
  const [results, setResults] = useState(null);
  const [started, setStarted] = useState(false);
  const [totalPoints, setTotalPoints] = useState(false);
  const { session, quizid } = useParams();
  const { token, points, addPoints } = useAuth();
  const {
    getQuestion,
    getAnswer,
    putAnswer,
    getResults,
  } = useSessions();
  const {
    getQuiz,
    advanceSession
  } = useQuizzes();
  const toast = useToast();
 
  useEffect(() => {
    const interval = setInterval(async () => {
      
      if (typeof(quizid) !== 'undefined') {
        // console.log(quizid);
        const quizInfo = await getQuiz(quizid);
        if (quizInfo.levelFormat == "Level") {
          setIsLevel(true);
        }
        let qs = quizInfo.questions;
        let totalP = 0;
        for (let i = 0; i < qs.length; i++) {
          totalP = totalP + qs[i].points
        }
        setTotalPoints(totalP);
        
      }
      try {
        const q = await getQuestion(session);
        // console.log(q);
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
            console.log(res);
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
          // console.log(msg);
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

  const handleStart = async () => {
    console.log("Start Game");
    if (!started) {
      await advanceSession(session);
      setStarted(true);
    }
    
  };

  // const handleStart = async () => {
  //   console.log("Starting");
  //   await advanceSession(session);
  // };

  return (
    <Box flexGrow={1}>
      <QuizContextProvider>
        <Box>
          <AuthContextProvider>
          {!question && !results && !isLevel && <Heading textAlign="center" mt="20vh" as="h1">Waiting for Game to Start</Heading>}
          { isLevel && !started &&
            <>
              <Heading textAlign="center" mt="20vh" as="h1">Get Ready! You could earn {totalPoints} Points</Heading>
              <Space h="4" />
              <Center alignSelf="center" alignContent="center" alignContent="center">
              <Button
                      width="50%"
                      height="100%"
                      fontSize="xl"
                      padding={4}
                      colorScheme="teal"
                      transition="all 250ms ease-in-out"
                      wordBreak="break-all"
                      wordWrap="break-word"
                      onClick={handleStart}
                    >
                      Start Level
                    </Button>
              </Center>
            </>
          }
            {question && (
              <GamePlayerQuestion
                question={question}
                correctAnswers={answer}
                session={session}
                onAnswerChange={handleAnswerChange}
              />
            )}
          
            {!question && results && (
              <PlayerResults results={results} />
            )}
          </AuthContextProvider>
        </Box>
      </QuizContextProvider>
    </Box>
  );
}

export default PlayGame;
