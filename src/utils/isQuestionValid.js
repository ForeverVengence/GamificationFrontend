const VALID_MEDIA_TYPES = ['image', 'video'];

function isQuestionValid(questionToCheck) {
  // CHeck te question object
  if (!questionToCheck) return false;
  if (typeof questionToCheck !== 'object') return false;
  const {
    id,
    question,
    type,
    duration,
    points,
    answers,
    correctAnswers,
    media,
  } = questionToCheck;
  if (!id) return false;
  if (!question || typeof question !== 'string') return false;
  if (type !== 'single' && type !== 'multiple') return false;
  if (!duration || !Number.isInteger(duration)) return false;
  if (!points || !Number.isInteger(points)) return false;
  if (
    !answers
    || !Array.isArray(answers)
    || answers.length < 2
    || answers.some((e) => typeof e !== 'string')
  ) { return false; }
  if (
    !correctAnswers
    || !Array.isArray(correctAnswers)
    || correctAnswers.length < 1
    || correctAnswers.some((e) => !Number.isInteger(e))
  ) return false;
  if (
    (type === 'single' && correctAnswers.length !== 1)
    || (type === 'multiple' && correctAnswers.length < 1)
  ) return false;
  if (media) {
    if (
      !VALID_MEDIA_TYPES.includes(media.type)
      || typeof media.src !== 'string'
    ) return false;
  }
  return true;
}
export default isQuestionValid;
