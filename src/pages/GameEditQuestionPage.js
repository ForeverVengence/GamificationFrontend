import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  // FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  FiArrowLeft, FiPlus, FiSave,
} from 'react-icons/fi';

import Container from '../components/Container';
import { useQuizzes } from '../context/QuizContext';
import areQuestionsEqual from '../utils/areQuestionsEqual';
import useTitle from '../hooks/useTitle';
import QuestionMediaInput from '../components/QuestionMediaInput';
import AnswerPresetMenu from '../components/AnswerPresetMenu';

function GameEditQuestionPage() {
  const { gameId, questionId } = useParams();
  const { getQuizQuestion, updateQuizQuestion } = useQuizzes();
  const [question, setQuestion] = useState({});
  const [updated, setUpdated] = useState({});
  const toast = useToast();

  const quizId = +gameId;

  useTitle('Edit Question');

  useEffect(() => {
    getQuizQuestion(quizId, questionId).then((q) => {
      setQuestion(q);
      setUpdated(q);
    });
  }, [quizId, questionId, getQuizQuestion]);

  useEffect(() => {
    if (updated.correctAnswers?.length === 1) {
      setUpdated((old) => ({ ...old, type: 'single' }));
    } else {
      setUpdated((old) => ({ ...old, type: 'multiple' }));
    }
  }, [updated.correctAnswers]);

  const handleFieldChange = (field) => (value) => {
    if (field === 'question') {
      setUpdated((old) => ({ ...old, [field]: value }));
    } else {
      setUpdated((old) => ({ ...old, [field]: +value }));
    }
  };

  const handleAnswerChange = (idx) => (e) => {
    setUpdated((old) => {
      const answers = old.answers.map((ans, i) => (i === +idx ? e.target.value : ans));
      return { ...old, answers };
    });
  };

  const addAnswer = () => {
    if (updated.answers.length < 6) {
      setUpdated((old) => ({ ...old, answers: [...old.answers, ''] }));
    }
  };

  const deleteAnswer = () => {
    setUpdated((old) => {
      if (old.answers.length > 2) {
        // const deleted = old.answers.splice(idx, 1);
        return { ...old };
      }
      return old;
    });
  };

  const handleCorrectAnswerChange = (idx) => (e) => {
    const i = +idx;
    setUpdated((old) => {
      let { correctAnswers } = old;

      if (e.target.checked) {
        correctAnswers = [...correctAnswers, i];
      } else if (correctAnswers.length > 1) {
        correctAnswers = correctAnswers.filter((a) => a !== i);
      }

      return { ...old, correctAnswers };
    });
  };

  const handlePreset = (val) => {
    setUpdated((old) => ({ ...old, answers: val, correctAnswers: [0] }));
  };

  const handleMediaChange = useCallback((media) => {
    setUpdated((old) => ({ ...old, media }));
  }, []);

  const handleSaveClick = async () => {
    await updateQuizQuestion(quizId, updated);
    toast({
      status: 'success',
      title: 'Question Saved',
      position: 'top',
      isClosable: true,
      duration: 1000,
    });
  };

  return (
    <Container>
      <Box mb={4}>
        <Link as={RouterLink} to={`/admin/edit/${gameId}`}>
          <Icon as={FiArrowLeft} />
          {' '}
          Back to quiz
        </Link>
      </Box>
      <Flex mb={6} align="center">
        <Heading as="h1" flexGrow={1}>
          Edit Question
        </Heading>
        <Button
          colorScheme="green"
          isDisabled={areQuestionsEqual(question, updated)}
          onClick={handleSaveClick}
          leftIcon={<FiSave />}
        >
          Save
        </Button>
      </Flex>
      <Stack as="form" spacing={4}>
        <FormControl isInvalid={updated.question === ''}>
          <FormLabel>Question Text</FormLabel>
          <Input
            value={updated.question || ''}
            type="text"
            isRequired
            onChange={(e) => handleFieldChange('question')(e.target.value)}
          />
          <FormErrorMessage>
            <FormErrorIcon />
            Question text is required.
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Points</FormLabel>
          <NumberInput min={0} value={updated.points || 0} onChange={handleFieldChange('points')}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Duration in Seconds (max 6000)</FormLabel>
          <NumberInput min={1} max={6000} value={updated.duration || 1} onChange={handleFieldChange('duration')}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <QuestionMediaInput value={question.media} onChange={handleMediaChange} />
        <Box mt={6}>
          <Flex align="center">
            <Heading flexGrow={1} as="h2" fontSize="lg" my={2}>
              Answers
            </Heading>

            <ButtonGroup isAttached size="sm">
              <Button
                colorScheme="green"
                onClick={addAnswer}
                leftIcon={<FiPlus />}
              >
                Add Answer
              </Button>
              <AnswerPresetMenu onSelect={handlePreset} />
            </ButtonGroup>
          </Flex>
          <Text fontSize="sm" mb={4}>
            You can have 2-6 answers and you need to have at least 1 correct answer.
          </Text>
          <Box>
            {updated.answers
              && Object.entries(updated.answers).map(([i, ans]) => (
                <FormControl isInvalid={!ans} mb={2} key={i}>
                  <InputGroup>
                    <InputLeftElement px={4} width="2.5rem">
                      <Checkbox
                        colorScheme="green"
                        isChecked={updated.correctAnswers.includes(+i)}
                        onChange={handleCorrectAnswerChange(+i)}
                      />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      value={ans}
                      onChange={handleAnswerChange(i)}
                    />
                    <InputRightElement width="6rem" zIndex="0">
                      <Button
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        height="1.75rem"
                        isDisabled={updated.answers.length <= 2}
                        onClick={() => deleteAnswer(+i)}
                      >
                        Delete
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    <FormErrorIcon />
                    Answer must be at least on character long.
                  </FormErrorMessage>
                </FormControl>
              ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}

export default GameEditQuestionPage;
