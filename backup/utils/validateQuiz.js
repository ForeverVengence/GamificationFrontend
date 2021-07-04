import isQuestionValid from './isQuestionValid';

function validateQuiz(quiz) {
  if (!quiz.name) throw new Error('Imported quiz is missing a name');
  if (typeof quiz.name !== 'string') throw new Error("Imported quiz's name is not a string");

  if (quiz.thumbnail && typeof quiz.thumbnail !== 'string') throw new Error("Imported quiz's thumbnail is not a string or null");

  if (!Array.isArray(quiz.questions)) throw new Error("Imported quiz's questions is not an array");
  quiz.questions.forEach((q, i) => {
    if (!isQuestionValid(q)) throw new Error(`Imported quiz question ${i} is not valid`);
  });

  return true;
}

export default validateQuiz;
