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
  InputGroup,
  Select
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ResponsiveButtonIcon from './ResponsiveButtonIcon';
import { useQuizzes } from '../context/QuizContext';
import {
  FiArrowLeft, FiSave, FiArrowDown,
} from 'react-icons/fi';

function AddToCourseButton({ courseCode, courseID, course }) {
  const { addLevelToCourse, removeLevelToCourse, createCourse, getOwnedCourses, quizzes, courses } = useQuizzes();
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('Select a Course');
  const [isAdding, setIsAdding] = useState(true);
  const [touched, setTouched] = useState(false);
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
    e.preventDefault();
    console.log(selectedCourse);
    console.log("Submit");
    // if (selectedCourse.includes("Select a Level")) {
    //   setError('Please select a valid Level!');
    // } else {
    //   resetErrors();
    //   console.log("Submitted");
    //   const res = await addLevelToCourse(courseID, selectedCourse);
    //   setselectedCourse('Select a Level');
    //   handleDialogClose();
    // }
  };

  const handleDelete = async (e) => {
    // Add New Course
    // e.preventDefault();
    // console.log(selectedCourse);
    // if (selectedCourse.includes("Select a Level")) {
    //   setError('Please select a valid Level!');
    // } else {
    //   resetErrors();
    //   console.log("Submitted");
    //   const res = await removeLevelToCourse(courseID, selectedCourse);
    //   setselectedCourse('Select a Level');
    //   handleDialogClose();
    // }
  };

  const handleLevelChange = (event) => {
    setTouched(true);
    console.log(event.target.value);
    setSelectedCourse(event.target.value);

    setIsAdding(true);
    // if (course.levels.includes(levelID)) {
    //   // Already in Course, change to Delete Button
    //   setIsAdding(false);
    // } else {
    //   // Not in course, set to Add Button
    //   setIsAdding(true);
    // }
  };

  return (
    <>
      <Button id="add-quiz" aria-label="Add Quiz" variant="outline" colorScheme="green" onClick={handleButtonClick} width="100%" mt="3">
        <ResponsiveButtonIcon icon={FiPlus} />
        <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
          Add To Course
        </Text>
      </Button>

      <Modal
        initialFocusRef={inputRef}
        onClose={handleDialogClose}
        isOpen={open}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Add To Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!error}>
              <FormControl>
                <FormLabel htmlFor="name">
                  Select Course to add level into
                </FormLabel>
                <InputGroup>
                <Select icon={<FiArrowDown />} placeholder="Select a Level" value={selectedCourse} onChange={handleLevelChange}>
                  {courses.map((item) => (
                    <option key={item.id}>{item.courseCode} {item.term} {item.year}</option>
                  ))}
                </Select>
              </InputGroup>

              </FormControl>
              <FormErrorMessage>
                <FormErrorIcon />
                {error}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button aria-label="Close" onClick={handleDialogClose}>Close</Button>
            {!selectedCourse.includes('Select a Course') ? (
              <>
                {isAdding ? (
                <Button
                  type="submit"
                  ml={3}
                  colorScheme="green"
                  aria-label="add quiz"
                >
                  Add Level to Course
                </Button>
              ) : (
                <Button
                  onClick={handleDelete}
                  ml={3}
                  colorScheme="red"
                  aria-label="add quiz"
                >
                  Remove Level from Course
                </Button>
            )}
              </>
            ) : null}
            
            
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddToCourseButton;
