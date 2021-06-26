import { Spinner, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

function Loader() {
  const loaderColor = useColorModeValue('green.500', 'green.300');

  return (
    <Spinner
      size="xl"
      color={loaderColor}
    />
  );
}

export default Loader;
