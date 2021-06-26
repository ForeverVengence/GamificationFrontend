import {
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Tag,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { FiEdit } from 'react-icons/fi';
import { MdDragHandle } from 'react-icons/md';
import QuestionType from '../types/QuestionType';
import QuestionDeleteButton from './QuestionDeleteButton';
import ResponsiveButtonIcon from './ResponsiveButtonIcon';

const bg = { light: 'gray.200', dark: 'gray.700' };

function QuestionsListItem({
  question: {
    id, question, duration, points,
  },
  index,
}) {
  const history = useHistory();
  const { colorMode } = useColorMode();
  const params = useParams();

  return (
    <Draggable draggableId={id} index={index} as="li">
      {
        (provided, snapshot) => (
          <Box
            data-rbd-draggable-context-id={provided.draggableProps['data-rbd-draggable-context-id']}
            data-rbd-draggable-id={provided.draggableProps['data-rbd-draggable-id']}
            onTransitionEnd={provided.draggableProps.onTransitionEnd}
            style={provided.draggableProps.style}
            ref={provided.innerRef}
            mb={4}
            shadow={snapshot.isDragging ? 'xl' : 'none'}
            transition="box-shadow 200ms ease-in-out"
          >
            <Flex
              borderRadius="lg"
              // as="li"
              align="center"
              p={2}
              bg={bg[colorMode]}
            >
              <Flex
                aria-describedby={provided.dragHandleProps['aria-describedby']}
                aria-label={provided.dragHandleProps['aria-describedby']}
                data-rbd-drag-handle-context-id={provided.dragHandleProps['data-rbd-drag-handle-context-id']}
                data-rbd-drag-handle-draggable-id={provided.dragHandleProps['data-rbd-drag-handle-draggable-id']}
                draggable={provided.dragHandleProps.draggable}
                onDragStart={provided.dragHandleProps.onDragStart}
                role={provided.dragHandleProps.role}
                tabIndex={provided.dragHandleProps.tabIndex}
                p={2}
                align="center"
                h="100%"
              >
                <Icon fill="white" as={MdDragHandle} />
              </Flex>
              <Box flexGrow={1} p={2} pl={4}>
                <Text wordBreak="break-word" fontWeight="bold" fontSize="xl" mt={2} mb={4}>
                  {question}
                </Text>
                <Box spacing={2}>
                  <Tag mr={2} mb={2}>
                    Duration
                    {' '}
                    {duration}
                    s
                  </Tag>
                  <Tag>
                    Points
                    {' '}
                    {points}
                  </Tag>
                </Box>
              </Box>
              <SimpleGrid flexShrink={0} columns={{ md: 2 }}>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  mr={2}
                  mb={2}
                  as={Link}
                  to={`${history.location.pathname}/question/${id}`}
                >
                  <ResponsiveButtonIcon icon={FiEdit} />
                  <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
                    Edit
                  </Text>
                </Button>
                <QuestionDeleteButton quizId={params.gameId} questionId={id} />
              </SimpleGrid>
            </Flex>
          </Box>
        )
      }

    </Draggable>
  );
}

QuestionsListItem.propTypes = {
  question: QuestionType.isRequired,
  index: PropTypes.number.isRequired,
};

export default QuestionsListItem;
