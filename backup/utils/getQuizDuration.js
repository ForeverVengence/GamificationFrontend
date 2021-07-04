function getQuizDuration(quiz) {
  return quiz.questions?.reduce((acc, { duration }) => acc + duration, 0) ?? 0;
}

export default getQuizDuration;
