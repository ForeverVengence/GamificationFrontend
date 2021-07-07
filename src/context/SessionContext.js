import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api';

export const SessionContext = createContext();

export function SessionContextProvider({ children }) {
  const [ids, setIds] = useLocalStorage('sessionIds', {});

  const getPlayerId = (session) => ids[+session];

  const join = async (session, name) => {
    const res = await api.post(`/play/join/${session}`, { name });
    setIds((old) => ({ ...old, [+session]: res.data.playerId }));
    console.log(res);
    return res.data.playerId;
  };

  const getQuestion = async (session) => {
    const res = await api.get(`/play/${getPlayerId(session)}/question`);
    return res.data.question;
  };

  const getAnswer = async (session) => {
    const res = await api.get(`/play/${getPlayerId(session)}/answer`);
    return res.data.answerIds;
  };

  const putAnswer = async (session, answerIds) => {
    const res = await api.put(`/play/${getPlayerId(session)}/answer`, { answerIds });
    return res.data.question;
  };

  const getResults = async (session) => {
    const res = await api.get(`/play/${getPlayerId(session)}/results`);
    return res.data;
  };

  return (
    <SessionContext.Provider value={{
      join,
      getPlayerId,
      getQuestion,
      getAnswer,
      putAnswer,
      getResults,
    }}
    >
      {children}
    </SessionContext.Provider>
  );
}

SessionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSessions = () => useContext(SessionContext);
