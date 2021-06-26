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
import React, { useRef, useState } from 'react';
import {
  FiBarChart2, FiCopy, FiPlay, FiSquare,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import QuizType from '../types/QuizType';
import Loader from './Loader';

function QuizControl({ quiz: { id, active, questions } }) {
  const [open, setOpen] = useState(false);
  const { startQuiz, stopQuiz } = useQuizzes();
  const [session, setSession] = useState();
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

  const handleStart = async () => {
    setIsQuizEnded(false);
    setSession('');
    setOpen(true);
    const sessionId = await startQuiz(id);
    setSession(sessionId);
  };

  const handleModalClose = async () => {
    setOpen(false);
  };

  return (
    <>
      {active ? (
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
            Play
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
          {isQuizEnded ? (
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
                {session ? 'Session ID' : 'Starting Quiz'}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody textAlign="center">
                {session ? (
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
