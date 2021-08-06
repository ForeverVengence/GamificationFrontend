/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
  Switch,
  useColorMode,
  Tag,
} from '@chakra-ui/react';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';

import { Link as RouterLink } from 'react-router-dom';
import Container from './Container';
import logoLight from './logo-light.svg';
import logoDark from './logo-dark.svg';
import { useAuth } from '../context/AuthContext';
// import useLocalStorage from '../hooks/useLocalStorage';

const logo = { light: logoLight, dark: logoDark };
const icon = { light: <FiMoon />, dark: <FiSun /> };

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [show, setShow] = useState(false);
  // const [points, setPoints] = useState(0);
  const { token, role, logout, setRole, email, points, addPoints, getCurrentPoints } = useAuth();
  // const [setroleData] = useLocalStorage('role', '');

  const openDrawer = () => {
    setShow(true);
  };

  const closeDrawer = () => {
    setShow(false);
  };

  const handleLogout = () => {
    closeDrawer();
    logout();
  };

  const getPoints = async ()  => {
    const res = await getCurrentPoints(email); 
    // const response = await addPoints(1000);
    // console.log(response);
    // setPoints(res.curr);
  };

  useEffect(() => {
    // getPoints();
    console.log('Do something after points has changed in Header', points);
  }, [points]);

  const navLinks = (
    <>
      {token !== null ? (
        <>
          {/* <Tag size="lg" key="lg" variant="solid" colorScheme="teal">
            {points} points
          </Tag> */}
          <Button
            justifyContent="flex-start"
            // as={RouterLink}
            // to="/game/join"
            // variant="link"
            colorScheme="teal"
            onClick={getPoints}
            aria-label="Join Game"
          >
            {points} Points
          </Button>
        </>
      ) : null}
      
      {token !== null && role === 'Staff' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/topicgroups"
          variant="link"
          aria-label="Topic Groups"
        >
          Topic Groups
        </Button>
      ) : null}
      {/* {token !== null && role === 'Staff' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/topicgroups"
          variant="link"
          aria-label="Topic Groups"
        >
          Topic Groups
        </Button>
      ) : null} */}
      {token !== null && role === 'Staff' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/admin"
          variant="link"
          aria-label="Admin Dashboard"
        >
          Levels
        </Button>
      ) : null}
      {token !== null && role === 'Staff' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/admin"
          variant="link"
          aria-label="Repository"
        >
          Repository
        </Button>
      ) : null}
      {token !== null && role === 'Student' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/student"
          variant="link"
          aria-label="Dashboard"
        >
          Dashboard
        </Button>
      ) : null}
      {token !== null && role === 'Student' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/shop"
          variant="link"
          aria-label="Shop"
        >
          Shop
        </Button>
      ) : null}
      {token !== null && role === 'Student' ? (
        <Button
          justifyContent="flex-start"
          as={RouterLink}
          onClick={closeDrawer}
          to="/leaderboards"
          variant="link"
          aria-label="Leaderboards"
        >
          Leaderboards
        </Button>
      ) : null}
      {token ? (
        <Button
          justifyContent="flex-start"
          onClick={handleLogout}
          variant="link"
          id="logout"
          aria-label="Logout"
        >
          Logout
        </Button>
      ) : (
        <>
          <Button
            justifyContent="flex-start"
            variant="link"
            as={RouterLink}
            onClick={closeDrawer}
            to="/login"
            aria-label="Login"
          >
            Login
          </Button>
          <Button
            justifyContent="flex-start"
            variant="link"
            as={RouterLink}
            onClick={closeDrawer}
            to="/register"
            aria-label="Register"
          >
            Register
          </Button>
        </>
      )}
    </>
  );

  return (
    <>
      <Box as="header" py={4} boxSizing="border-box">
        <Container>
          <Flex justify="space-between" align="center">
            <RouterLink to="/">
              <Image
                height="2rem"
                src={`${logo[colorMode]}`}
                alt="BigBrain logo"
                width="130px"
              />
            </RouterLink>

            <Flex>
              <Tooltip label="Toggle dark mode">
                <IconButton
                  onClick={toggleColorMode}
                  variant="ghost"
                  icon={icon[colorMode]}
                  mr={4}
                  aria-label="Toggle Dark Mode"
                />
              </Tooltip>
              <Stack
                isInline
                display={{ base: 'none', md: 'flex' }}
                spacing={{ base: 0, md: 5 }}
                align="stretch"
                as="nav"
              >
                {navLinks}
              </Stack>
              <IconButton
                display={{ base: 'inline-flex', md: 'none' }}
                onClick={openDrawer}
                icon={<FiMenu />}
                variant="ghost"
                aria-label="Open Menu"
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Drawer onClose={closeDrawer} isOpen={show}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton aria-label="Close Drawer" top={5} right={6} zIndex={100} />
          <DrawerBody p={6}>
            <Stack as="nav" spacing={6}>
              {navLinks}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Header;
