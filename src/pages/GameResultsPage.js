import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Icon,
  Link,
  SimpleGrid,
} from '@chakra-ui/react';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight, FiSquare } from 'react-icons/fi';
import Container from '../components/Container';
import MidQuizInfo from '../components/MidQuizInfo';
import PostQuizInfo from '../components/PostQuizInfo';
import PreQuizInfo from '../components/PreQuizInfo';
import { useQuizzes } from '../context/QuizContext';
import useTitle from '../hooks/useTitle';
import areStatusesEqual from '../utils/areStatusesEqual';
import Loader from '../components/Loader';

const FETCH_INTERVAL = 1000;

function GameResultsPage() {
  const { sessionId } = useParams();
  const {
    advanceSession,
    stopSession,
    getQuiz,
    getSessionQuiz,
    getAdminStatus,
    getAdminResults,
  } = useQuizzes();
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({});
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef();

  useTitle(`Session ${sessionId} Results`);

  let advanceText = 'Start First Question';
  if (status.position === status.questions?.length - 1) {
    advanceText = 'End Quiz';
  } else if (status.position !== -1) {
    advanceText = 'Next Question';
  }

  useEffect(() => {
    let timeout;
    const fetchStatus = async () => {
      const res = await getAdminStatus(sessionId);

      setStatus((old) => {
        if (areStatusesEqual(old, res)) {
          return old;
        }
        return {
          ...old,
          ...res,
        };
      });

      if (res.active) {
        timeout = setTimeout(fetchStatus, FETCH_INTERVAL);
      } else if (res.position === res.questions.length) {
        setResults(await getAdminResults(sessionId));
      }
    };

    fetchStatus();

    return () => {
      clearTimeout(timeout);
    };
  }, [getAdminStatus, getAdminResults, sessionId, getQuiz, getSessionQuiz]);

  const handleEnd = useCallback(async () => {
    setResults(await getAdminResults(sessionId));
  }, [sessionId, getAdminResults]);

  const handleDialogClose = useCallback(() => {
    setConfirming(false);
  }, []);

  const handleTryStart = useCallback(async () => {
    setConfirming(true);
  }, []);

  const handleAdvance = useCallback(async () => {
    if (confirming) setConfirming(false);
    console.log(sessionId);
    const res = await advanceSession(sessionId);
    console.log(res);
    setStatus((old) => ({ ...old, position: res }));
    if (res >= status.questions.length) {
      handleEnd();
    } else {
      setStatus(await getAdminStatus(sessionId));
    }
  }, [
    advanceSession,
    sessionId,
    confirming,
    handleEnd,
    status.questions?.length,
    getAdminStatus,
  ]);

  const handleStop = async () => {
    await stopSession(sessionId);
    handleEnd();
  };

  return (
    <>
      <Container>
        <Box mb={4}>
          <Link as={RouterLink} to="/admin">
            <Icon as={FiArrowLeft} />
            {' '}
            Back to dashboard
          </Link>
        </Box>
        {Object.keys(status).length === 0 ? (
          <Box textAlign="center" mt="30vh">
            <Loader />
          </Box>
        ) : (
          <>
            {status.active && (
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FiSquare fill="currentColor" />}
                  onClick={handleStop}
                >
                  Stop Quiz
                </Button>
                <Button
                  colorScheme="green"
                  rightIcon={<FiChevronRight />}
                  onClick={
                    status.players.length || status.position !== -1
                      ? handleAdvance
                      : handleTryStart
                  }
                >
                  {advanceText}
                </Button>
              </SimpleGrid>
            )}
            {status.active && status.position === -1 && (
              <PreQuizInfo status={status} sessionId={sessionId} />
            )}
            {status.active
              && status.position >= 0
              && status.position < status.questions.length && (
                <MidQuizInfo status={status} />
            )}
            {!status.active && (
              <PostQuizInfo status={status} results={results} />
            )}
          </>
        )}
      </Container>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
        isOpen={confirming}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Start this Session?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            This session has no players. Are you sure you want to start the
            first question?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button colorScheme="green" ml={3} onClick={handleAdvance}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default GameResultsPage;
