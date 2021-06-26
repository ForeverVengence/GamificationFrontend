export default function areQuestionsSame(q1, q2) {
  if (
    q1.id !== q2.id
    || q1.question !== q2.question
    || q1.duration !== q2.duration
    || q1.points !== q2.points
    || q1.answers?.length !== q2.answers?.length
    || q1.correctAnswers?.length !== q2.correctAnswers?.length
  ) return false;

  for (let i = 0; i < q1.answers?.length; i += 1) {
    if (q1.answers[i] !== q2.answers[i]) return false;
  }

  for (let i = 0; i < q1.correctAnswers?.length; i += 1) {
    if (q1.correctAnswers[i] !== q2.correctAnswers[i]) return false;
  }

  if (q1.media !== q2.media) {
    return false;
  }

  if (q1.media) {
    if (
      q1.media.type !== q2.media.type
      || q1.media.src !== q2.media.src
    ) return false;
  }

  return true;
}
