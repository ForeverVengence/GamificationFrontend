/* eslint-disable */
import { Box } from '@chakra-ui/react';
import React from 'react';

function Spacer({ w = 0, h = 0 }) {
  return (
    <Box mb={h ?? 0} mr={w ?? 0} />
  );
}

export default Spacer;
