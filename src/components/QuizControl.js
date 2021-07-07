/* eslint-disable */
import {
  Box,
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import React, { useRef, useState, useEffect } from 'react';
import {
  FiBarChart2, FiCopy, FiPlay, FiSquare,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import QuizType from '../types/QuizType';
import Loader from './Loader';

function QuizControl({ quiz: { id, active, questions, levelFormat, levelType } }) {
  const [open, setOpen] = useState(false);
  const { startQuiz, stopQuiz, getQuiz } = useQuizzes();
  const [session, setSession] = useState();
  const [isLiveQuiz, setIsLiveQuiz] = useState();
  const [playText, setPlayText] = useState();
  const playerUrl = `${window.location.origin}/game/join/${session}`;
  const { onCopy, hasCopied } = useClipboard(playerUrl);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const copyRef = useRef();
  const toast = useToast();

  const handleStop = async () => {
    setSession(active);
    try {
      await stopQuiz(id);
      setIsQuizEnded(true);
      setOpen(true);
    } catch (err) {
      if (err?.response?.data?.error) {
        toast({
          status: 'error',
          title: 'User Error',
          description: err.response.data.error,
          isClosable: true,
          duration: 5000,
        });
      }
    }
  };

  // This triggers the start of quiz.
  // Need to make logic
  // If (Level) -> download whole quiz and run locally
  // If (Kahoot) -> do as per current game
  const handleStart = async () => {
    

    if (levelFormat == "Live Quiz") {
      setIsQuizEnded(false);
      setSession('');
      setOpen(true);
      const sessionId = await startQuiz(id);
      setSession(sessionId);
    } else {
      console.log(questions);
      console.log(levelFormat);
      // Push to play game that has no session on backend

    }

  };

  const handleModalClose = async () => {
    setOpen(false);
  };

  useEffect(() => {

    let totalPoints = 0;
    for (let i = 0; i < questions.length; i++) {
      totalPoints = totalPoints + questions[i].points
    }

    if (levelFormat == "Live Quiz") {
      setIsLiveQuiz(true);
    } else {
      
      setIsLiveQuiz(false);
    }

    // Check if user has played this before
    // If not display earn total points
    setPlayText('Earn ' + totalPoints.toString() + ' Points');

    // Else only earn 20% of total points


  });

  return (
    <>
      {active && isLiveQuiz? (
        <SimpleGrid columns={2} spacing={4}>
          <Button
            leftIcon={<FiBarChart2 />}
            colorScheme="green"
            variant="outline"
            as={Link}
            to={`/admin/results/${active}`}
          >
            Results
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            leftIcon={<FiSquare fill="currentColor" />}
            onClick={handleStop}
            id={`stop-quiz-${id}`}
          >
            Stop
          </Button>
        </SimpleGrid>
      ) : (
        <Tooltip
          shouldWrapChildren
          label="This quiz needs questions to be started"
          isDisabled={questions.length}
        >
          <Button
            colorScheme="green"
            variant="outline"
            leftIcon={<FiPlay fill="currentColor" />}
            width="100%"
            isDisabled={questions.length === 0}
            onClick={handleStart}
            id={`start-quiz-${id}`}
          >
            {playText}
          </Button>
        </Tooltip>
      )}

      <Modal
        isOpen={open}
        closeOnOverlayClick={false}
        isCentered
        onClose={handleModalClose}
        initialFocusRef={copyRef}
        size="xl"
        motionPreset="none"
      >
        <ModalOverlay />
        <ModalContent>
          {isQuizEnded && isLiveQuiz ? (
            <>
              <ModalHeader>Quiz Ended</ModalHeader>
              <ModalCloseButton />
              <ModalBody textAlign="center">
                <Text fontSize="lg">Would you like to view the results?</Text>
              </ModalBody>
              <ModalFooter>
                <Button mr={2} onClick={handleModalClose}>
                  No
                </Button>
                <Button
                  colorScheme="green"
                  as={Link}
                  to={`/admin/results/${session}`}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                {session && isLiveQuiz ? 'Session ID' : 'Starting Level'}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody textAlign="center">
                {session && isLiveQuiz ? (
                  <Box mb={4}>
                    <Heading as="h2" fontSize="lg" fontWeight="normal">
                      Session Code
                    </Heading>
                    <Text
                      as="p"
                      fontSize="6rem"
                      fontWeight="bold"
                      fontFamily="heading"
                    >
                      {session}
                    </Text>
                    <Heading as="h2" fontSize="lg" mb={4} fontWeight="normal">
                      Direct Link
                    </Heading>
                    <Input
                      isReadOnly
                      value={playerUrl}
                      textAlign="center"
                      colorScheme="green"
                    />
                    <SimpleGrid columns={2} spacing={4} mt={4}>
                      <Button
                        leftIcon={<FiBarChart2 />}
                        as={Link}
                        to={`/admin/results/${session}`}
                        colorScheme="green"
                        variant="ghost"
                      >
                        Go to Live Results
                      </Button>
                      <Button
                        ref={copyRef}
                        colorScheme="green"
                        leftIcon={<FiCopy />}
                        onClick={() => onCopy(playerUrl)}
                      >
                        {hasCopied ? 'Copied' : 'Copy Link'}
                      </Button>
                    </SimpleGrid>
                  </Box>
                ) : (
                  <Loader />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

QuizControl.propTypes = {
  quiz: QuizType.isRequired,
};

export default QuizControl;
