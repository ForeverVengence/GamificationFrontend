/* eslint-disable */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useToast } from '@chakra-ui/react';
import { Redirect, useHistory } from 'react-router';

import api from '../api';
import newQuestion from '../utils/newQuestion';
import { useAuth } from './AuthContext';

const QuizContext = createContext();

export default QuizContext;

async function fetchQuiz(quizId) {
  const { data } = await api.get(`/admin/quiz/${quizId}`);
  return { ...data, id: quizId };
}

async function fetchQuizzes() {
  const { data } = await api.get('/admin/quiz');

  const all = data.quizzes.map(async (q) => {
    const quiz = await fetchQuiz(q.id);
    return { ...q, ...quiz };
  });

  const resolved = await Promise.all(all);

  return resolved;
}

const doUserErrorToast = (toast, msg) => toast({
  title: 'User Error',
  description: msg,
  status: 'error',
  isClosable: true,
  position: 'top',
});

const doSuccessToast = (toast, msg) => toast({
  title: 'Success',
  description: msg,
  status: 'success',
  isClosable: true,
  position: 'top',
});

export function QuizContextProvider({ children }) {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const history = useHistory();
  const toast = useToast();

  const rc = useRef(0);
  rc.current += 1;
  const fetchAll = useCallback(async () => {
    try {
      setQuizzes(await fetchQuizzes());
      setCourses(await getOwnedCourses());
      setShopItems(await getShopItems());
    } catch (err) {
      if (err.response?.status === 403) {
        toast({
          title: 'Not logged in',
          description: 'You need to be logged in to access ',
          status: 'error',
          isClosable: true,
          position: 'top',
        });
        history.replace('/login');
      }
    }
  }, [toast, history]);

  const userErrorToast = useCallback((err) => doUserErrorToast(
    toast, err?.response?.data?.error || 'An error occurred',
  ), [toast]);

  const successToast = useCallback((res) => doSuccessToast(
    toast, res || 'An error occurred',
  ), [toast]);

  useEffect(() => {
    // console.log('Do something after counter has changed', courses);
    if (token && !quizzes.length && !courses.length) {
      setLoading(true);
      fetchAll().then(() => {
        setLoading(false);
      });
    }
  }, [fetchAll, token, quizzes.length, courses.length]);

  const getQuiz = useCallback(
    async (quizId, force = false) => {
      let quiz = quizzes.find((q) => +q.id === +quizId);
      
      if (!quiz || force) {
        try {
          quiz = await fetchQuiz(quizId);

          setQuizzes(
            (old) => old.map(
              (q) => (q.id === quizId ? { ...q, ...quiz } : q),
            ),
          );
        } catch (err) {
          if (err.response.data?.error === 'Invalid quiz ID') {
            history.replace('/not-found', { quizId });
          }
        }
      }
      // console.log(quiz);
      return quiz;
    },
    [quizzes, history],
  );

  const createQuiz = useCallback(async (name) => {
    try {
      const {
        data: { quizId },
      } = await api.post('/admin/quiz/new', { name });
      const { data: newQuiz } = await api.get(`/admin/quiz/${quizId}`);
      newQuiz.id = +quizId;
      newQuiz.isNew = true;
      setQuizzes((old) => [
        newQuiz,
        ...old,
      ]);
      setTimeout(() => {
        newQuiz.isNew = false;
      }, 5000);
      successToast("Level Created!");
      return quizId;
    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [userErrorToast]);

  const createCourse = useCallback(async (courseCode, startDate, endDate, term, year) => {
    try {
      const course = await api.post('/admin/course/new', { courseCode, startDate, endDate, term, year });
      
      setCourses((old) => [
        course,
        ...old,
      ]);
      // console.log(courses);
      // setTimeout(() => {
      //   newQuiz.isNew = false;
      // }, 5000);
      successToast("Course Created!");
      return course;
    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [userErrorToast]);

  const addLevelToCourse = useCallback(async (courseID, quizIDString) => {

    // Split to get the quiz ID from string
    const arr = quizIDString.split("| ");
    const levelID = arr[1];

    try {

      const temp = await api.post('/admin/course/addLevel', { courseID, levelID });
      // Update Latest Course List
      setCourses(await getOwnedCourses());
      successToast("Level Added to " + courseID);
      return null;
    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [userErrorToast]);

  const removeLevelToCourse = useCallback(async (courseID, quizIDString) => {

    // Split to get the quiz ID from string
    const arr = quizIDString.split("| ");
    const levelID = arr[1];

    console.log(levelID);
    

    try {

      const temp = await api.post('/admin/course/removeLevel', { courseID, levelID });
      // Update Latest Course List
      setCourses(await getOwnedCourses());
      successToast("Level removed from  " + courseID);
      return null;
    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [userErrorToast]);

  const getOwnedCourses = useCallback(async () => {
    
    try {
      const temp = await api.post('/admin/myCourses');
      // console.log(temp.data);
      // setCourses(temp.data);
      
      return temp.data;

    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [userErrorToast]);

  const getShopItems = useCallback(async () => {
    
    try {
      const temp = await api.post('/admin/shop/items');
      // console.log(temp.data);
      // setCourses(temp.data);
      
      return temp.data;

    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [userErrorToast]);

  const updateQuiz = useCallback(
    async (quizId, { questions, name, thumbnail, week, levelType, levelFormat, totalPoints }) => {
      
      try {
        
        console.log(totalPoints);
        await api.put(`/admin/quiz/${quizId}`, { questions, name, thumbnail, week, levelType, levelFormat });
        setQuizzes((old) => {
          const quiz = old.find((q) => +q.id === +quizId);

          if (quiz) {
            if (questions) quiz.questions = questions;
            if (name) quiz.name = name;
            if (thumbnail) quiz.thumbnail = thumbnail;
            if (levelType) quiz.levelType = levelType;
            if (levelFormat) quiz.levelFormat = levelFormat;
            if (totalPoints) quiz.totalPoints = totalPoints;
            return [...old];
          }

          return old;
        });
      } catch (err) {
        userErrorToast(err);
      }
    },
    [userErrorToast],
  );

  const deleteQuiz = useCallback(async (quizId) => {
    try {
      await api.delete(`/admin/quiz/${quizId}`);
      setQuizzes((old) => old.filter((quiz) => +quiz.id !== +quizId));
    } catch (err) {
      userErrorToast(err);
    }
  }, [userErrorToast]);

  const startQuiz = useCallback(async (quizId) => {
    try {
      await api.post(`/admin/quiz/${quizId}/start`);
      const quiz = await getQuiz(quizId, true);
      return quiz.active;
    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [getQuiz, userErrorToast]);

  const advanceQuiz = useCallback(async (quizId) => {
    try {
      const res = await api.post(`/admin/quiz/${quizId}/advance`);
      const quiz = await getQuiz(quizId);
      if (res.data.stage >= quiz.questions.length) {
        getQuiz(quizId, true);
      }
      return res.data.stage;
    } catch (err) {
      userErrorToast(err);
    }
    return null;
  }, [getQuiz, userErrorToast]);

  const getSessionQuiz = useCallback((session) => {
    const quiz = quizzes.find((q) => q.active === +session);
    return quiz;
  }, [quizzes]);

  const advanceSession = useCallback(async (session) => {
    // console.log(session);
    const quiz = getSessionQuiz(session);
    // console.log(quiz);
    if (quiz) {
      const res = await advanceQuiz(quiz.id);
      getQuiz(quiz.id, true);
      return res;
    }
    return null;
  }, [getQuiz, getSessionQuiz, advanceQuiz]);

  const stopQuiz = useCallback(async (quizId) => {
    try {
      await api.post(`/admin/quiz/${quizId}/end`);
      await getQuiz(quizId, true);
    } catch (err) {
      userErrorToast(err);
    }
  }, [getQuiz, userErrorToast]);

  const stopSession = useCallback(async (session) => {
    const quiz = getSessionQuiz(session);
    if (quiz) {
      return stopQuiz(quiz.id);
    }
    return null;
  }, [getSessionQuiz, stopQuiz]);

  const getQuizQuestion = useCallback(
    async (quizId, questionId) => {
      const quiz = await getQuiz(quizId);
      const question = quiz.questions.find((q) => q.id === questionId);
      if (question) { return question; }
      history.push('/not-found', { quizId, questionId });
      return null;
    },
    [getQuiz, history],
  );

  const createQuizQuestion = useCallback(
    async (quizId) => {
      const quiz = quizzes.find((q) => q.id === quizId);
      if (!quiz.questions) {
        quiz.questions = [];
      }
      quiz.questions.push(newQuestion());
      await updateQuiz(quizId, { questions: quiz.questions });
      successToast("Question Added!");
    },
    [quizzes, updateQuiz],
  );

  const updateQuizQuestion = useCallback(async (quizId, question) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    const questions = quiz.questions.map((q) => (q.id === question.id ? question : q));
    await updateQuiz(quizId, { questions });
  }, [quizzes, updateQuiz]);

  const deleteQuizQuestion = useCallback(
    async (quizId, questionId) => {
      const quiz = quizzes.find((q) => q.id == quizId);
      await updateQuiz(quizId, {
        questions: quiz.questions.filter((q) => q.id !== questionId),
      });
    },
    [quizzes, updateQuiz],
  );

  const getAdminStatus = useCallback(async (sessionId) => {
    const { data } = await api.get(`/admin/session/${sessionId}/status`);
    return data.results;
  }, []);

  const getAdminResults = useCallback(async (sessionId) => {
    const { data } = await api.get(`/admin/session/${sessionId}/results`);
    return data.results;
  }, []);


  const getAssignedCoursesWithInfo = useCallback(async (sessionId) => {
    const { data } = await api.post(`/admin/getAssignedCoursesWithInfo`);
    // console.log(data);
    return data.results;
  }, []);

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        courses,
        shopItems,
        loading,
        getQuiz,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        startQuiz,
        advanceQuiz,
        advanceSession,
        stopQuiz,
        stopSession,
        getSessionQuiz,
        getQuizQuestion,
        createQuizQuestion,
        createCourse,
        updateQuizQuestion,
        deleteQuizQuestion,
        getAdminStatus,
        getAdminResults,
        getOwnedCourses,
        addLevelToCourse,
        removeLevelToCourse,
        getShopItems,
        getAssignedCoursesWithInfo,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

QuizContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useQuizzes = () => useContext(QuizContext);
