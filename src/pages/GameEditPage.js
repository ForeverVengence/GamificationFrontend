import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  Prompt, Link as RouterLink, useParams, useHistory,
} from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiSave } from 'react-icons/fi';

import Container from '../components/Container';
import QuestionsList from '../components/QuestionsList';
import ThumbnailInput from '../components/ThumbnailInput';
import ResponsiveButtonIcon from '../components/ResponsiveButtonIcon';
import { useQuizzes } from '../context/QuizContext';
import useTitle from '../hooks/useTitle';
import QuizExportButton from '../components/QuizExportButton';

function GameEditPage() {
  const params = useParams();
  const {
    loading, getQuiz, updateQuiz, createQuizQuestion,
  } = useQuizzes();
  const toast = useToast();
  const history = useHistory();

  const [quiz, setQuiz] = useState({});

  const [name, setName] = useState('');
  const [week, setWeek] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const isNameChanged = name !== quiz?.name;
  const isThumbnailChanged = thumbnail !== quiz?.thumbnail;
  const isWeekChanged = week !== quiz?.week;

  useTitle('Edit Level');

  useEffect(() => {
    if (params.gameId) {
      getQuiz(+params.gameId).then((q) => {
        console.log(q);
        if (q) {
          setQuiz(q);
          setName(q.name);
          setThumbnail(q.thumbnail);
          setWeek(q.week);
        }
      });
    } else {
      history.replace('/admin');
    }
  }, [getQuiz, params.gameId, history]);

  const doUpdate = (opts) => updateQuiz(+params.gameId, opts);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleWeekChange = (e) => {
    setWeek(e.target.value);
  };
  const resetName = () => {
    setName(quiz.name);
  };
  const resetWeek = () => {
    setName(quiz.week);
  };
  const handleThumbnailChange = (newThumbnail) => {
    setThumbnail(newThumbnail);
  };
  // This is triggered when SAVE
  const handleNameThumbnailSubmit = async (event) => {
    event.preventDefault();
    if (!isNameChanged && !isThumbnailChanged && !isWeekChanged) return;
    try {
      await doUpdate({
        name: isNameChanged ? name : null,
        thumbnail: isThumbnailChanged ? thumbnail : null,
        week: isWeekChanged ? week : null,
      });
      toast({
        title: 'Saved your changes',
        status: 'success',
        position: 'top',
        duration: 1000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Save Error',
        description: 'An error occurred while saving your changes. Please try again later.',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleQuestionsReorder = (result) => {
    if (!result.destination) return;
    const start = result.source.index;
    const dest = result.destination.index;
    if (start === dest) return;
    const copy = [...quiz.questions];
    const [removed] = copy.splice(start, 1);
    copy.splice(dest, 0, removed);
    doUpdate({ questions: copy });
    setQuiz({ ...quiz, questions: copy });
  };

  return (
    <Container>
      <Prompt
        when={quiz && (isNameChanged || isThumbnailChanged)}
        message="Are you sure you want to leave? Your changes may not be saved."
      />
      <Box mb={4}>
        <Link as={RouterLink} to="/admin">
          <Icon as={FiArrowLeft} />
          {' '}
          Back to dashboard
        </Link>
      </Box>
      <Flex mb={6}>
        <Heading flexGrow="1" as="h1">
          Edit Level
        </Heading>
        <QuizExportButton quiz={quiz} />
      </Flex>
      <form onSubmit={handleNameThumbnailSubmit}>
        <Flex mb={3}>
          <Heading as="h2" size="lg" flexGrow={1}>
            General Information
          </Heading>
          <Button
            colorScheme="green"
            type="submit"
            leftIcon={<FiSave />}
          >
            Save
          </Button>
        </Flex>
        <Box mb={6}>
          <FormControl mb={4} isInvalid={!loading && name === ''}>
            <FormLabel htmlFor="name">Level Name</FormLabel>
            <InputGroup>
              <Input
                autoComplete="off"
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
                paddingRight="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <Button
                  size="sm"
                  height="1.75rem"
                  isDisabled={!isNameChanged}
                  onClick={resetName}
                >
                  Reset
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              <FormErrorIcon />
              Course Code is required.
            </FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!loading && name === ''}>
            <FormLabel htmlFor="name">Week Number</FormLabel>
            <InputGroup>
              <Input
                autoComplete="off"
                id="week"
                name="week"
                value={week}
                onChange={handleWeekChange}
                paddingRight="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <Button
                  size="sm"
                  height="1.75rem"
                  isDisabled={!isWeekChanged}
                  onClick={resetWeek}
                >
                  Reset
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              <FormErrorIcon />
              Week Number is required.
            </FormErrorMessage>
          </FormControl>
          <ThumbnailInput
            defaultValue={quiz?.thumbnail || ''}
            value={thumbnail}
            onThumbnailChange={handleThumbnailChange}
          />
          <Box textAlign="right" mt={4} />
        </Box>
      </form>

      <Flex align="center" mt={6} mb={2}>
        <Heading as="h2" size="lg" flexGrow={1}>
          Questions
        </Heading>
        <Button
          colorScheme="green"
          onClick={() => createQuizQuestion(+params.gameId)}
          id="add-question"
        >
          <ResponsiveButtonIcon icon={FiPlus} />
          <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
            Add a question
          </Text>
        </Button>
      </Flex>
      {quiz?.questions?.length
        ? <Text fontSize="md" mb={6}>Drag a question by the handle on the left to reorder.</Text> : null}
      {quiz?.questions?.length ? (
        <QuestionsList
          questions={quiz.questions}
          onDragEnd={handleQuestionsReorder}
        />
      ) : (
        <Text fontSize="xl" textAlign="center">
          This quiz doesn&apos;t have any questions yet.
        </Text>
      )}
    </Container>
  );
}

export default GameEditPage;
