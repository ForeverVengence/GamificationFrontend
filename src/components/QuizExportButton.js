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
import { FiShare } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import QuizType from '../types/QuizType';

function QuizExportButton({ quiz }) {
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef();

  const handleExport = () => {
    const toExport = {
      name: quiz.name,
      thumbnail: quiz.thumbnail,
      questions: quiz.questions,
    };

    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
    saveAs(blob, `quiz-${quiz.name}.json`);
  };

  const handleDialogClose = () => {
    setConfirming(false);
  };

  const handleClick = () => {
    if (quiz.questions.length) {
      handleExport();
    } else {
      setConfirming(true);
    }
  };

  return (
    <>
      <Button colorScheme="green" onClick={handleClick} leftIcon={<FiShare />}>
        Export
      </Button>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
        isOpen={confirming}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Export this quiz?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            This quiz has no questions. Are you sure you want to export this quiz?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button colorScheme="green" ml={3} onClick={handleExport}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

QuizExportButton.propTypes = {
  quiz: QuizType.isRequired,
};

export default QuizExportButton;
