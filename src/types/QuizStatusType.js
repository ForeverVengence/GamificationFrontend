import PropTypes from 'prop-types';
import QuestionType from './QuestionType';

const QuizStatusType = PropTypes.shape({
  active: PropTypes.bool,
  answerAvailable: PropTypes.bool,
  position: PropTypes.number,
  questions: PropTypes.arrayOf(QuestionType),
  players: PropTypes.arrayOf(PropTypes.string),
});

export default QuizStatusType;
