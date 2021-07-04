/* eslint-disable */
import { AspectRatio, Box } from '@chakra-ui/react';
import React from 'react';

function YoutubeVideo({ video = 'dQw4w9WgXcQ', ratio = (16 / 9) }) {
  return (
    <AspectRatio position="relative" ratio={ratio}>
      <Box>
        <iframe
          title={`video ${video}`}
          style={{
            position: 'absolute', top: '0', left: '0', height: '100%', width: '100%',
          }}
          src={`https://www.youtube.com/embed/${video}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </Box>
    </AspectRatio>
  );
}

export default YoutubeVideo;
