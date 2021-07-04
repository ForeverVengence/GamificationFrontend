import PropTypes from 'prop-types';
import QuestionType from './QuestionType';

export default PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  owner: PropTypes.string,
  thumbnail: PropTypes.string,
  questions: PropTypes.arrayOf(QuestionType),
  createdAt: PropTypes.string,
});
