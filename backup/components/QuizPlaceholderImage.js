/* eslint-disable */
import React from 'react';
import { Image } from '@chakra-ui/react';
import placeholderImage from './placeholder.png';

function QuizPlaceholderImage({ absolute = true }) {
  return (
    <Image
      src={placeholderImage}
      alt="Quiz thumbnail placeholder image"
      position={absolute ? 'absolute' : 'static'}
      top="0"
      left="0"
      objectFit="cover"
      width="100%"
      bg="gray.300"
      opacity="0.5"
    />
  );
}

export default QuizPlaceholderImage;
