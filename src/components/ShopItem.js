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
import QuizDeleteButton from './QuizDeleteButton';
import QuizPlaceholderImage from './QuizPlaceholderImage';
import QuizControl from './QuizControl';
// import OldSessionsMenu from './OldSessionsMenu';
import { SessionContextProvider } from '../context/SessionContext';
import getQuizDuration from '../utils/getQuizDuration';
import Space from './Space';

const cardBg = { light: 'gray.200', dark: 'gray.700' };

const ShopItem = ({ item }) => {
  const {
    name, type, desc, duration, cost, quantity, sellingFast
  } = item;
  const { colorMode } = useColorMode();
  const { role } = useAuth();

  // const durationInSeconds = getQuizDuration(quiz);
  // const quizData = getQuiz(quiz);

  // const image = thumbnail
  //   ? <Image src={thumbnail} objectFit="contain" alt={name} width="100%" />
  //   : <QuizPlaceholderImage />;

    const image = <QuizPlaceholderImage />;

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
          <Tag size="lg" variant="solid" colorScheme="red" position="absolute" top={4} left={4}>
            <TagLeftIcon as={FiCircle} fill="white" color="white" />
            <TagLabel>{quantity} Left</TagLabel>
          </Tag>
          {sellingFast === true && (
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
              Selling Fast
            </Box>
          )}
        <Box p="4">
          <Text fontWeight="bold" fontSize="xl" mb={4}>{name}</Text>
          <SimpleGrid columns={1} justifyContent="center" columnGap={0}>
            <Tag justifyContent="center">
              {desc}
            </Tag>
          </SimpleGrid>
          <Space h={3} />
          
          <SimpleGrid columns={2} justifyContent="center" columnGap={4}>
            { duration === "Single Use" ? (
              <Tag justifyContent="center">
                {duration}
              </Tag>
            ) : (
              <Tag justifyContent="center">
                  {duration} Minutes
              </Tag>
            )}
            
            <Tag justifyContent="center">
              {type}
            </Tag>
          </SimpleGrid>
          <Space h={3} />
          {quantity > 0 ? (
            <>
              <SimpleGrid columns={1} gap={4} my={4}>
                <Button
                  as={Link}
                  // to={`/admin/edit/${id}`}
                  variant="outline"
                  colorScheme="green"
                  leftIcon={<FiEdit />}
                >
                  Use {cost} Points
                </Button>
              </SimpleGrid>
            </>
          ) : (
            <>
              <SimpleGrid columns={1} gap={4} my={4}>
                <Button
                  as={Link}
                  // to={`/admin/edit/${id}`}
                  variant="outline"
                  colorScheme="green"
                  leftIcon={<FiEdit />}
                  disabled="true"
                >
                  Sold Out
                </Button>
              </SimpleGrid>
            </>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

// ShopItem.propTypes = {
//   quiz: QuizType.isRequired,
// };

export default ShopItem;
