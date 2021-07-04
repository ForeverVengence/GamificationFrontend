import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import YoutubeVideo from './YoutubeVideo';
import getVideoIdFromUrl from '../utils/getVideoIdFromUrl';

function URLMediaPreview({ url = '', type = '' }) {
  let videoId;
  if (type === 'video') {
    videoId = getVideoIdFromUrl(url);
  }

  const valid = (
    (type === 'image' && url)
    || (type === 'video' && videoId)
  );

  return (
    <>
      <Box my={2} mx="auto">
        {valid
          ? (
            <>
              {type === 'image'
            && <Image width="100%" src={url} alt="preview of selected image" />}
              {(type === 'video')
            && <YoutubeVideo video={videoId} />}
            </>
          )
          : <Text>No valid media was provided.</Text>}
      </Box>
    </>
  );
}

export default URLMediaPreview;
