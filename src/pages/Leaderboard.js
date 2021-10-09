/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  SimpleGrid,
  Menu,
  MenuButton,
  Tag,
  MenuList,
  Stack,
  MenuOptionGroup,
  MenuItemOption,
  HStack,
} from '@chakra-ui/react';
import {
  useHistory,
} from 'react-router-dom';
import { AnimateSharedLayout } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import api from '../api';
import Container from '../components/Container';
import Space from '../components/Space';
import QuizPreview from '../components/QuizPreview';
// import QuizAddButton from '../components/QuizAddButton';
import Loader from '../components/Loader';
import { useQuizzes } from '../context/QuizContext';
import useTitle from '../hooks/useTitle';
import getQuizDuration from '../utils/getQuizDuration';
import { AuthContextProvider, useAuth } from '../context/AuthContext';

const sortTypes = {
  none: {
    display: 'None',
    cmp: () => 0,
  },
  name: {
    display: 'Quiz Name',
    cmp: (a, b) => new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: 'true' }).compare(a.name, b.name),
  },
  createdAt: {
    display: 'Time Created',
    cmp: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  numQuestions: {
    display: 'Number of Questions',
    cmp: (a, b) => a.questions.length - b.questions.length,
  },
  duration: {
    display: 'Total Duration',
    cmp: (a, b) => getQuizDuration(a) - getQuizDuration(b),
  },
  timesPlayed: {
    display: 'Number of Times Played',
    cmp: (a, b) => a.oldSessions.length - b.oldSessions.length,
  },
};

function Leaderboard() {
  const { quizzes, loading, getAssignedCoursesWithInfo } = useQuizzes();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sortKey, setSortKey] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');
  const { role, setRole, points, email } = useAuth();
  const history = useHistory();

  const filterDisabled = loading || quizzes.length === 0;

  const switchRoles = () => {
    if (role === 'Staff') {
      setRole('Student');
      history.push('/student');
    } else {
      setRole('Staff');
      history.push('/admin');
    }
  };

  useTitle('Student Levels');

  useEffect(() => {
    console.log(quizzes);
    setFiltered(() => {
      let res = quizzes.filter((q) => q.name.includes(search));
      res = quizzes.filter((q) => q.assignedTo.includes(email));
      if (sortKey !== 'none') {
        res.sort(sortTypes[sortKey].cmp);
        if (sortOrder === 'desc') {
          res.reverse();
        }
      }
      return res;
    });

    // Pull user's list of courses
    api.post(`/admin/getAssignedCoursesWithInfo`)
    .then(response => {
      setCourses(response.data);
      console.log(response.data);
    });


  }, [search, sortKey, sortOrder, quizzes]);

  let mainContent;

  if (loading) {
    mainContent = (
      <Box textAlign="center" mt="30vh">
        <Loader />
      </Box>
    );
  } else if (quizzes.length === 0) {
    mainContent = (
      <Text fontSize="xl" textAlign="center">
        You don&apos;t have anything assigned yet
      </Text>
    );
  } else {
    mainContent = (
      <AnimateSharedLayout>
        <AuthContextProvider>
          {/* <Grid
            templateColumns="repeat(auto-fit, 17rem)"
            justifyContent="space-around"
            columnGap={8}
            rowGap={10}
          >
            {
              filtered.length
                ? filtered.map((quiz) => <QuizPreview key={quiz.id} quiz={quiz} />)
                : <Text fontSize="xl" textAlign="center">No quizzes match this filter</Text>
            }
          </Grid> */}
        </AuthContextProvider>
      </AnimateSharedLayout>
    );
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortKeyChange = (val) => {
    setSortKey(val);
  };

  const handleSortOrderChange = (val) => {
    setSortOrder(val);
  };

  function Feature({ title, desc, ...rest }) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" {...rest} borderRadius="10px">
        <Heading fontSize="xl">{title}</Heading>
        {/* <Text mt={2}>{desc}</Text> */}
      </Box>
    )
  }

  function Feature2() {
    return (
      <HStack mt="50">
        <Box p={3} shadow="md" borderWidth="1px" borderRadius="10px" width="33%" height="40">
        <Heading fontSize="xl">1st Place</Heading>
        <Text justifyContent="center" textAlign="center" fontSize="25" mt={5}>Juliet Smith</Text>
        <Text justifyContent="center" textAlign="center" fontSize="20" mt={0}>86 921 Points</Text>
        </Box>
        <Box p={3} shadow="md" borderWidth="1px" borderRadius="10px" width="33%" height="40">
        <Heading fontSize="xl">2nd Place</Heading>
        <Text justifyContent="center" textAlign="center" fontSize="25" mt={5}>James Smith</Text>
        <Text justifyContent="center" textAlign="center" fontSize="20" mt={0}>69 224 Points</Text>
        </Box>
        <Box p={3} shadow="md" borderWidth="1px" borderRadius="10px" width="33%" height="40">
        <Heading fontSize="xl">3rd Place</Heading>
        <Text justifyContent="center" textAlign="center" fontSize="25" mt={5}>Mike Smith</Text>
        <Text justifyContent="center" textAlign="center" fontSize="20" mt={0}>52 231 Points</Text>
        </Box>
      </HStack>
    )
  }

  return (
    <Container>
      <Flex align="center" mt={6} mb={4}>
        <Heading as="h1" flexGrow="1">
          Leaderboards
        </Heading>
      </Flex>

      {
        courses.length
          ? courses.map((quiz) => 
          <>
            <Heading as="h3" flexGrow="1" mt="10" mb="10">{quiz.courseCode} {quiz.term} {quiz.year}</Heading>
            <Stack spacing={3}>
              <Feature
                title="💪 Earn 8000 points to rank up!"
                desc="Complete a Level Weekly throughout the term to earn 50 000 points!"
              />
              <Feature
                title="🎓 You have increased 13 ranks last week!"
                desc="You deserve good things. With a whooping 10-15% interest rate per annum"
              />
              <Feature
                title="🏆 Currently Ranked 43/310 Students"
                desc="You deserve good things. With a whooping 10-15% interest rate per annum"
              />
            </Stack>
            <Feature2 />
          </>
          ) : <Heading as="h3" flexGrow="1" mt="10">You are not in any course</Heading>
      }

      
      <Space h={3} />

      {/* {filterDisabled ? null : (
        <SimpleGrid overflow="visible" px={2} spacing={4} columns={{ base: 1, sm: 2 }} pt={2} pb={4}>
          <Input
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search"
          />
          <Menu placement="bottom-end" closeOnSelect={false}>
            <MenuButton zIndex={10} as={Button} rightIcon={<FiChevronDown />}>
              {sortKey !== 'none' ? `Sorting by ${sortTypes[sortKey].display} ${sortOrder === 'asc' ? '↑' : '↓'}` : 'Sort'}
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                value={sortKey}
                title="Sort key"
                type="radio"
                onChange={handleSortKeyChange}
              >
                {Object.entries(sortTypes)?.map(([key, { display }]) => (
                  <MenuItemOption key={key} value={key}>{display}</MenuItemOption>
                ))}
              </MenuOptionGroup>
              <MenuOptionGroup
                value={sortOrder}
                title="Sort Order"
                type="radio"
                onChange={handleSortOrderChange}
              >
                <MenuItemOption isDisabled={sortKey === 'none'} value="asc">Ascending</MenuItemOption>
                <MenuItemOption isDisabled={sortKey === 'none'} value="desc">Descending</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </SimpleGrid>
      )} */}

      {mainContent}

      <Space h={6} />
    </Container>
  );
}

export default Leaderboard;
