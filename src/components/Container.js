import React from 'react';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function Container({ children }) {
  return (
    <Box
      width="100%"
      maxWidth={{
        sm: 'container.sm', md: 'container.md', lg: 'container.lg',
      }}
      flexGrow="1"
      mx="auto"
      px="1em"
    >
      {children}
    </Box>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
