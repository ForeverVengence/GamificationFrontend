import { Icon } from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';

function ResponsiveButtonIcon({ icon }) {
  return (
    icon ? <Icon as={icon} ml={-1} mr={{ base: -1, sm: 0 }} /> : 'no icon given'
  );
}

ResponsiveButtonIcon.propTypes = {
  icon: PropTypes.func.isRequired,
};

export default ResponsiveButtonIcon;
