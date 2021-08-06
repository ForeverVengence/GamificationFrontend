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

function CourseAddLevelButton({ courseCode, courseID, course }) {
  const { addLevelToCourse, removeLevelToCourse, createCourse, getOwnedCourses, quizzes } = useQuizzes();
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('Select a Level');
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
    console.log(selectedLevel);
    if (selectedLevel.includes("Select a Level")) {
      setError('Please select a valid Level!');
    } else {
      resetErrors();
      console.log("Submitted");
      const res = await addLevelToCourse(courseID, selectedLevel);
      setSelectedLevel('Select a Level');
      handleDialogClose();
    }
  };

  const handleDelete = async (e) => {
    // Add New Course
    e.preventDefault();
    console.log(selectedLevel);
    if (selectedLevel.includes("Select a Level")) {
      setError('Please select a valid Level!');
    } else {
      resetErrors();
      console.log("Submitted");
      const res = await removeLevelToCourse(courseID, selectedLevel);
      setSelectedLevel('Select a Level');
      handleDialogClose();
    }
  };

  const handleLevelChange = (event) => {
    setTouched(true);
    console.log(event.target.value);
    console.log(course);
    const arr = event.target.value.split("| ");
    const levelID = arr[1];
    setSelectedLevel(event.target.value);
    if (course.levels.includes(levelID)) {
      // Already in Course, change to Delete Button
      setIsAdding(false);
    } else {
      // Not in course, set to Add Button
      setIsAdding(true);
    }
  };

  return (
    <>
      <Button id="add-quiz" aria-label="Add Quiz" variant="outline" colorScheme="green" onClick={handleButtonClick}>
        <ResponsiveButtonIcon icon={FiPlus} />
        <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
          Edit Levels
        </Text>
      </Button>

      <Modal
        initialFocusRef={inputRef}
        onClose={handleDialogClose}
        isOpen={open}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Edit {courseCode} Levels</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!error}>
              <FormControl>
                <FormLabel htmlFor="name">
                  Select Level to be added or removed for {courseCode}
                </FormLabel>
                {/* <Input autoComplete="off" ref={inputRef} id="courseCode" name="courseCode" value={courseCode} onChange={handleCourseCodeChange} /> */}
                <InputGroup>
                <Select icon={<FiArrowDown />} placeholder="Select a Level" value={selectedLevel} onChange={handleLevelChange}>
                  {quizzes.map((item) => (
                    <option key={item.key}>{item.name} | {item.id}</option>
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
            {!selectedLevel.includes('Select a Level') ? (
              <>
                {isAdding ? (
                <Button
                  type="submit"
                  ml={3}
                  colorScheme="green"
                  aria-label="add quiz"
                >
                  Add Level
                </Button>
              ) : (
                <Button
                  onClick={handleDelete}
                  ml={3}
                  colorScheme="red"
                  aria-label="add quiz"
                >
                  Remove Level
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

export default CourseAddLevelButton;
