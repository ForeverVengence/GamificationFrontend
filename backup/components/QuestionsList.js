import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import QuestionType from '../types/QuestionType';
import QuestionsListItem from './QuestionsListItem';

function QuestionsList({ questions, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd} as="ul">
      <Droppable droppableId="questions-list">
        {
          (provided, snapshot) => (
            <Box
              data-rbd-droppable-context-id={provided.droppableProps['data-rbd-droppable-context-id']}
              data-rbd-droppable-id={provided.droppableProps['data-rbd-droppable-id']}
              ref={provided.innerRef}
              shadow={snapshot.isDraggingOver ? 'outline' : 'none'}
              borderRadius="lg"
              listStyleType="none"
              transition="box-shadow 200ms ease-in-out"
            >
              {questions.map((q, i) => <QuestionsListItem key={q.id} question={q} index={i} />)}
              {provided.placeholder}
            </Box>
          )
        }
      </Droppable>

    </DragDropContext>
  );
}

QuestionsList.defaultProps = {
  onDragEnd: () => {},
};

QuestionsList.propTypes = {
  questions: PropTypes.arrayOf(QuestionType).isRequired,
  onDragEnd: PropTypes.func,
};

export default QuestionsList;
