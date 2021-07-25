import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiTrash2 } from 'react-icons/fi';
import { useQuizzes } from '../context/QuizContext';

function CourseDeleteButton({ quizId }) {
  const { deleteQuiz } = useQuizzes();
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef();

  const handleButtonClick = () => {
    setConfirming(true);
  };

  const handleDialogClose = () => {
    setConfirming(false);
  };

  const handleConfirmDelete = async () => {
    await deleteQuiz(quizId);
    handleDialogClose();
  };

  return (
    <>
      <Button onClick={handleButtonClick} variant="outline" colorScheme="red" leftIcon={<FiTrash2 />}>Delete</Button>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
        isOpen={confirming}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete this quiz?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this quiz?
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

CourseDeleteButton.propTypes = {
  quizId: PropTypes.number.isRequired,
};

export default CourseDeleteButton;
