/* eslint-disable */
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

function CourseAddButton() {
  const { createQuiz, updateQuiz, createCourse, getOwnedCourses } = useQuizzes();
  const [open, setOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');

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
    // Add New Course
    console.log({ courseCode: courseCode, startDate: startDate, endDate: endDate, term: term, year: year });
    e.preventDefault();
    resetErrors();
    if (courseCode) {
      const res = await createCourse(courseCode, startDate, endDate, term, year);
      const newCourseID = res.data.courseId;
      console.log(newCourseID);
      // const linkToEdit = `/admin/edit/${newQuizID}`;

      // Close and navigate away
      handleDialogClose();
      // history.push(linkToEdit);

    } else if (file) {
      if (file.type !== 'application/json') {
        setError('Uploaded file is not a JSON file.');
      }
    }

    // The below is for JSON upload
    //   setImporting(true);
    //   try {
    //     const json = await uploadJson(file);
    //     await validateQuiz(json);
    //     const { name: quizName, thumbnail, questions } = json;
    //     const id = await createQuiz(quizName);
    //     await updateQuiz(id, { thumbnail, questions });
    //     handleDialogClose();
    //   } catch (err) {
    //     setFileError(err.message);
    //   } finally {
    //     setImporting(false);
    //   }
    // } else {
    //   setError('You need to give the quiz a name or select a JSON file');
    // }
  };

  const handleCourseCodeChange = (e) => {
    setTouched(true);
    setCourseCode(e.target.value);
  };
  const handleStartDateChange = (e) => {
    // setTouched(true);
    setStartDate(e.target.value);
  };
  const handleEndDateChange = (e) => {
    // setTouched(true);
    setEndDate(e.target.value);
  };

  const handleTermChange = (e) => {
    // setTouched(true);
    setTerm(e.target.value);
  };

  const handleYearChange = (e) => {
    // setTouched(true);
    setYear(e.target.value);
  };

  const handleFileChange = (e) => {
    setTouched(true);
    setFile(e.target.files.length ? e.target.files[0] : null);
  };

  return (
    <>
      <Button id="add-quiz" aria-label="Add Quiz" variant="solid" colorScheme="green" onClick={handleButtonClick}>
        <ResponsiveButtonIcon icon={FiPlus} />
        <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
          New Course
        </Text>
      </Button>

      <Modal
        initialFocusRef={inputRef}
        onClose={handleDialogClose}
        isOpen={open}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Add a Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!error}>
              <FormControl>
                <FormLabel htmlFor="name">
                  Course Code
                </FormLabel>
                <Input autoComplete="off" ref={inputRef} id="courseCode" name="courseCode" value={courseCode} onChange={handleCourseCodeChange} />
                <FormLabel htmlFor="name">
                  Start Date for course
                </FormLabel>
                <Input autoComplete="off" id="startDate" name="startDate" value={startDate} onChange={handleStartDateChange} />
                <FormLabel htmlFor="name">
                  End Date for course
                </FormLabel>
                <Input autoComplete="off" id="endDate" name="endDate" value={endDate} onChange={handleEndDateChange} />
                <FormLabel htmlFor="name">
                  Term
                </FormLabel>
                <Input autoComplete="off" id="term" name="term" value={term} onChange={handleTermChange} />
                <FormLabel htmlFor="name">
                  Year
                </FormLabel>
                <Input autoComplete="off" id="year" name="year" value={year} onChange={handleYearChange} />
              </FormControl>
              <Text my={4} fontStyle="italic" textAlign="center" fontSize="lg">or</Text>
              <FormControl isInvalid={!!fileError}>
                <FormLabel htmlFor="file">
                  Load a course from a JSON file.
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
              isDisabled={touched && !courseCode && !file}
              type="submit"
              ml={3}
              colorScheme="green"
              aria-label="add quiz"
            >
              {name && 'Create New Course'}
              {!name && file && 'Import Course'}
              {!name && !file && 'Add Course'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CourseAddButton;
