import { Box } from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const Countdown = React.memo(({ timeLeft, size }) => {
  const time = timeLeft > 0 ? timeLeft : "";
  return (
    <Box position="relative" textAlign="center" fontFamily="monospace">

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          key={timeLeft}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', position: 'absolute' }}
        >
          <Box
            fontSize={size}
            fontFamily="heading"
            color={timeLeft <= 30 ? 'red.500' : 'white'}
            transition="color 250ms linear"
            mx="auto"
          >
            {time}
          </Box>
        </motion.div>
      </AnimatePresence>

      <Box
        aria-hidden
        fontSize={size}
        fontFamily="heading"
        opacity="0"
        px={16}
      >
        {time}
      </Box>

    </Box>
  );
});

Countdown.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any),
  ]),
};

Countdown.defaultProps = {
  size: { base: '4rem', sm: '5rem', md: '6rem' },
};

export default Countdown;
