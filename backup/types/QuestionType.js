import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['single', 'multiple']).isRequired,
  duration: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  answers: PropTypes.arrayOf(PropTypes.string),
  correctAnswers: PropTypes.arrayOf(PropTypes.number),
  media: PropTypes.shape({
    type: PropTypes.oneOf(['image', 'video']),
    src: PropTypes.string,
  }),
});
