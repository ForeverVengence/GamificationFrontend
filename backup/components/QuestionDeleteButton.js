import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiTrash2 } from 'react-icons/fi';
import { useQuizzes } from '../context/QuizContext';
import ResponsiveButtonIcon from './ResponsiveButtonIcon';

function QuestionDeleteButton({ quizId, questionId }) {
  const { deleteQuizQuestion } = useQuizzes();
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef();

  const handleButtonClick = () => {
    setConfirming(true);
  };

  const handleDialogClose = () => {
    setConfirming(false);
  };

  const handleConfirmDelete = () => {
    handleDialogClose();
    deleteQuizQuestion(quizId, questionId);
  };

  return (
    <>
      <Button mr={2} colorScheme="red" variant="outline" onClick={handleButtonClick}>
        <ResponsiveButtonIcon icon={FiTrash2} />
        <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
          Delete
        </Text>
      </Button>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
        isOpen={confirming}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete this question?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this question?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleConfirmDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

QuestionDeleteButton.propTypes = {
  quizId: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default QuestionDeleteButton;
