export default function newQuestion() {
  return {
    id: `${Date.now() + Math.random()}`,
    question: 'New question',
    type: 'single',
    points: 1000,
    duration: 10,
    answers: [
      'correct',
      'wrong',
    ],
    correctAnswers: [
      0,
    ],
    media: null,
  };
}
