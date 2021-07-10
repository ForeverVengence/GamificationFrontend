import React from 'react';
import { Link } from 'react-router-dom';
import {
  AspectRatio,
  Box, Button, Image, SimpleGrid, Tag, TagLeftIcon, TagLabel, Text, useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCircle, FiEdit } from 'react-icons/fi';

import QuizType from '../types/QuizType';
import QuizDeleteButton from './QuizDeleteButton';
import QuizPlaceholderImage from './QuizPlaceholderImage';
import QuizControl from './QuizControl';
// import OldSessionsMenu from './OldSessionsMenu';
import { SessionContextProvider } from '../context/SessionContext';
import getQuizDuration from '../utils/getQuizDuration';
import Space from './Space';

const cardBg = { light: 'gray.200', dark: 'gray.700' };

const QuizPreview = ({ quiz }) => {
  const {
    id, active, name, thumbnail, questions, isNew, levelFormat, levelType, week,
  } = quiz;
  const { colorMode } = useColorMode();

  const durationInSeconds = getQuizDuration(quiz);
  // const quizData = getQuiz(quiz);

  const image = thumbnail
    ? <Image src={thumbnail} objectFit="contain" alt={name} width="100%" />
    : <QuizPlaceholderImage />;

  // useEffect(() => {
    
  //   console.log(quiz);


  // });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        position="relative"
        bg={cardBg[colorMode]}
        borderRadius="lg"
        transition="all 100ms ease-in-out"
        overflow="hidden"
        _hover={{
          shadow: 'xl',
        }}
      >
        <AspectRatio
          width="100%"
          ratio={1}
        >
          {image}
        </AspectRatio>
        {active ? (
          <Tag size="lg" variant="solid" colorScheme="red" position="absolute" top={4} left={4}>
            <TagLeftIcon as={FiCircle} fill="white" color="white" />
            <TagLabel>Active</TagLabel>
          </Tag>
        ) : null}
        {isNew && (
          <Box
            bg="red.500"
            color="white"
            transform="rotate(45deg)"
            position="absolute"
            textAlign="center"
            width="10rem"
            top="1rem"
            right="-3rem"
          >
            New
          </Box>
        )}
        <Box p="4">
          <Text fontWeight="bold" fontSize="xl" mb={4}>{name}</Text>
          <SimpleGrid columns={1} justifyContent="center" columnGap={0}>
            <Tag justifyContent="center">
              Week
              {' '}
              {week}
            </Tag>
          </SimpleGrid>
          <Space h={3} />
          <SimpleGrid columns={2} justifyContent="center" columnGap={4}>
            <Tag justifyContent="center">
              {levelType}
            </Tag>
            <Tag justifyContent="center">
              {levelFormat}
            </Tag>
          </SimpleGrid>
          <Space h={3} />
          <SimpleGrid columns={2} justifyContent="center" columnGap={4}>
            <Tag justifyContent="center">
              {questions?.length || 0}
              {' '}
              questions
            </Tag>
            <Tag justifyContent="center">
              {Math.ceil(durationInSeconds / 60)}
              {' '}
              minutes
            </Tag>
          </SimpleGrid>
          <SimpleGrid columns={2} gap={4} my={4}>
            <Button
              as={Link}
              to={`/admin/edit/${id}`}
              variant="outline"
              colorScheme="blue"
              leftIcon={<FiEdit />}
            >
              Edit
            </Button>
            <QuizDeleteButton quizId={id} />
          </SimpleGrid>
          {/* <OldSessionsMenu oldSessions={oldSessions} /> */}
          <SessionContextProvider>
            <QuizControl quiz={quiz} />
          </SessionContextProvider>
        </Box>
      </Box>
    </motion.div>
  );
};

QuizPreview.propTypes = {
  quiz: QuizType.isRequired,
};

export default QuizPreview;
