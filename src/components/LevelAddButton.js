import React, { useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ResponsiveButtonIcon from './ResponsiveButtonIcon';
import { useQuizzes } from '../context/QuizContext';
import uploadJson from '../utils/uploadJson';
import validateQuiz from '../utils/validateQuiz';

function LevelAddButton() {
  const { createQuiz, updateQuiz } = useQuizzes();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();
  const history = useHistory();

  const handleButtonClick = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const resetErrors = () => {
    setError('');
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();
    if (name) {
      const newQuizID = await createQuiz(name);
      const linkToEdit = `/admin/edit/${newQuizID}`;
      setName('');
      handleDialogClose();
      history.push(linkToEdit);
    } else if (file) {
      if (file.type !== 'application/json') {
        setError('Uploaded file is not a JSON file.');
      }
      setImporting(true);
      try {
        const json = await uploadJson(file);
        await validateQuiz(json);
        const { name: quizName, thumbnail, questions } = json;
        const id = await createQuiz(quizName);
        await updateQuiz(id, { thumbnail, questions });
        handleDialogClose();
      } catch (err) {
        setFileError(err.message);
      } finally {
        setImporting(false);
      }
    } else {
      setError('You need to give the quiz a name or select a JSON file');
    }
  };

  const handleNameChange = (e) => {
    setTouched(true);
    setName(e.target.value);
  };

  const handleFileChange = (e) => {
    setTouched(true);
    setFile(e.target.files.length ? e.target.files[0] : null);
  };

  return (
    <>
      <Button id="add-quiz" aria-label="Add Quiz" variant="solid" colorScheme="red" onClick={handleButtonClick}>
        <ResponsiveButtonIcon icon={FiPlus} />
        <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
          New Level
        </Text>
      </Button>

      <Modal
        initialFocusRef={inputRef}
        onClose={handleDialogClose}
        isOpen={open}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Add a Level</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!error}>
              <FormControl>
                <FormLabel htmlFor="name">
                  Give your new level a name
                </FormLabel>
                <Input autoComplete="off" ref={inputRef} id="name" name="name" value={name} onChange={handleNameChange} />
              </FormControl>
              <Text my={4} fontStyle="italic" textAlign="center" fontSize="lg">or</Text>
              <FormControl isInvalid={!!fileError}>
                <FormLabel htmlFor="file">
                  Load a level from a JSON file.
                </FormLabel>
                <Input
                  autoComplete="off"
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                />
                <FormErrorMessage>
                  <FormErrorIcon />
                  {fileError}
                </FormErrorMessage>
              </FormControl>
              <FormErrorMessage>
                <FormErrorIcon />
                {error}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button aria-label="Close" onClick={handleDialogClose}>Close</Button>
            <Button
              isLoading={importing}
              isDisabled={touched && !name && !file}
              type="submit"
              ml={3}
              colorScheme="green"
              aria-label="add quiz"
            >
              {name && 'Create New Level'}
              {!name && file && 'Import Level'}
              {!name && !file && 'Add Level'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LevelAddButton;
