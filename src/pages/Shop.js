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
  Switch,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react';
import {
  useHistory,
} from 'react-router-dom';
import { AnimateSharedLayout } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

import Container from '../components/Container';
import Space from '../components/Space';
import QuizPreview from '../components/QuizPreview';
// import QuizAddButton from '../components/QuizAddButton';
import Loader from '../components/Loader';
import { useQuizzes } from '../context/QuizContext';
import useTitle from '../hooks/useTitle';
import getQuizDuration from '../utils/getQuizDuration';
import { AuthContextProvider, useAuth } from '../context/AuthContext';
import ShopItem from '../components/ShopItem';

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

function Shop() {
  const { quizzes, loading, shopItems } = useQuizzes();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
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

  useTitle('Shop');

  useEffect(() => {
    console.log(quizzes);
    console.log(shopItems);
    // Get Shop Items

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
  }, [search, sortKey, sortOrder, quizzes, shopItems]);

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
          <Grid
            templateColumns="repeat(auto-fit, 17rem)"
            justifyContent="space-around"
            columnGap={8}
            rowGap={10}
          >
            {
              shopItems.data.length
                ? shopItems.data.map((item) => <ShopItem key={item.code} item={item} />)
                : <Text fontSize="xl" textAlign="center">No items match this filter</Text>
            }
          </Grid>
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

  return (
    <Container>
      <Flex align="center" mt={6} mb={4}>
        <Heading as="h1" flexGrow="1">
          Shop
        </Heading>
        <Text>
          Quantities indicated are for the term across all students
        </Text>
      </Flex>

      {filterDisabled ? null : (
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
      )}

      {mainContent}

      <Space h={6} />
    </Container>
  );
}

export default Shop;
