/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AspectRatio,
  Box, Button, Image, SimpleGrid, Tag, TagLeftIcon, TagLabel, Text, useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCircle, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import QuizType from '../types/QuizType';
import CourseDeleteButton from './CourseDeleteButton';
import CourseAddLevelButton from './CourseAddLevelButton';
import QuizPlaceholderImage from './QuizPlaceholderImage';
// import OldSessionsMenu from './OldSessionsMenu';
import getQuizDuration from '../utils/getQuizDuration';
import Space from './Space';

const cardBg = { light: 'gray.200', dark: 'gray.700' };

const CoursePreview = ({ course }) => {
  const {
    id, active, courseCode, startDate, endDate, levels, owner, term, year, createdAt,
  } = course;
  const { colorMode } = useColorMode();
  const { role, email } = useAuth();

  // const durationInSeconds = getQuizDuration();
  // const quizData = getQuiz(quiz);

  // const image = thumbnail
  //   ? <Image src={thumbnail} objectFit="contain" alt={name} width="100%" />
  //   : <QuizPlaceholderImage />;

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
        {/* <AspectRatio
          width="100%"
          ratio={1}
        >
          {image}
        </AspectRatio> */}
        {active ? (
          <Tag size="lg" variant="solid" colorScheme="red" position="absolute" top={4} left={4}>
            <TagLeftIcon as={FiCircle} fill="white" color="white" />
            <TagLabel>Active</TagLabel>
          </Tag>
        ) : null}
        {/* {isNew && (
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
        )} */}
        <Box p="4">
          <Text fontWeight="bold" fontSize="xl" mb={4}>{courseCode}_{term}_{year}</Text>
          <SimpleGrid columns={1} justifyContent="center" columnGap={0}>
            <Tag justifyContent="center">
              {typeof(levels) == 'undefined' ? (
                0
              ) : (
                <>
                  {levels.length}
                </>
              )}
              {' '}
              Levels
            </Tag>
          </SimpleGrid>
          <Space h={3} />
          <SimpleGrid columns={1} justifyContent="center" columnGap={4}>
            <Tag justifyContent="center">
              {startDate} - {endDate}
            </Tag>
          </SimpleGrid>
          {/* <Space h={3} /> */}
          {/* <SimpleGrid columns={2} justifyContent="center" columnGap={4}>
            <Tag justifyContent="center">
              {year}
            </Tag>
            <Tag justifyContent="center">
              {term}
            </Tag>
          </SimpleGrid> */}
          {role == 'Staff' ? (
            <>
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
                <CourseAddLevelButton courseCode={courseCode} courseID={id} />
                <Button
                  as={Link}
                  to={`/admin/edit/${id}`}
                  variant="outline"
                  colorScheme="purple"
                  leftIcon={<FiEdit />}
                >
                  Export
                </Button>
                <CourseDeleteButton quizId={id} />
              </SimpleGrid>
              
            </>
          ) : null}
          
        </Box>
      </Box>
    </motion.div>
  );
};

// QuizPreview.propTypes = {
//   quiz: QuizType.isRequired,
// };

export default CoursePreview;
