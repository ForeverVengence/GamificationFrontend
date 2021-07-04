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

export function QuizContextProvider({ children }) {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const history = useHistory();
  const toast = useToast();

  const rc = useRef(0);
  rc.current += 1;
  const fetchAll = useCallback(async () => {
    try {
      setQuizzes(await fetchQuizzes());
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

  useEffect(() => {
    if (token && !quizzes.length) {
      setLoading(true);
      fetchAll().then(() => {
        setLoading(false);
      });
    }
  }, [fetchAll, token, quizzes.length]);
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
      console.log(courses);
      // setTimeout(() => {
      //   newQuiz.isNew = false;
      // }, 5000);
      return course;
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
    const quiz = getSessionQuiz(session);
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

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <QuizContext.Provider
      value={{
        quizzes,
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
        updateQuizQuestion,
        deleteQuizQuestion,
        getAdminStatus,
        getAdminResults,
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
