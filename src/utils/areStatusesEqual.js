function areStatusesEqual(s1, s2) {
  if (s1 === s2) return true;

  return (
    s1
    && s2
    && s1.active === s2.active
    && s1.answerAvailable === s2.answerAvailable
    && s1.isoTimeLastQuestionStarted === s2.isoTimeLastQuestionStarted
    && s1.position === s2.position
    && s1.numQuestions === s2.numQuestions
    && s1.players.length === s2.players.length
  );
}

export default areStatusesEqual;
