import {
  Button,
  Collapse,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  useColorMode,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import URLMediaPreview from './URLMediaPreview';
import uploadImage from '../utils/uploadImage';
import getVideoIdFromUrl from '../utils/getVideoIdFromUrl';

const MEDIA_TYPES = {
  none: 'no helper media',
  imgUpload: 'upload an image',
  youtubeUrl: 'youtube video',
};

const PLACEHOLDERS = {
  [MEDIA_TYPES.none]: '',
  [MEDIA_TYPES.imgUpload]: '',
  [MEDIA_TYPES.youtubeUrl]: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

function getMediaTypeFromMedia(media) {
  if (!media) {
    return MEDIA_TYPES.none;
  }

  if (media.type === 'video') {
    return MEDIA_TYPES.youtubeUrl;
  }

  if (media.type === 'image') {
    if (!media.src) return null;
    return MEDIA_TYPES.upload;
  }

  return null;
}

function getInputTypeFromMediaType(mediaType) {
  if (mediaType === MEDIA_TYPES.imgUpload) return 'file';
  return 'text';
}

async function getSrc(mediaType, input) {
  if (mediaType === MEDIA_TYPES.none) {
    return null;
  }

  if (input === '') return null;

  if (mediaType === MEDIA_TYPES.imgUpload) {
    const src = await uploadImage(input);
    return src;
  }

  if (mediaType === MEDIA_TYPES.youtubeUrl) {
    const videoId = getVideoIdFromUrl(input);
    if (!videoId) {
      throw new Error(
        'Url is not a youtube video. It should look something like this: https://youtube.com/watch?v=dQw4w9WgXcQ',
      );
    }
    return input;
  }

  throw new Error('invalid input');
}

function QuestionMediaInput({ value, onChange }) {
  const { colorMode } = useColorMode();
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState('text');
  const [mediaType, setMediaType] = useState(MEDIA_TYPES.none);
  const [preview, setPreview] = useState(false);
  const [updated, setUpdated] = useState({});
  const [error, setError] = useState('');
  const initial = useRef(true);

  useEffect(() => {
    const m = getMediaTypeFromMedia(value);
    const i = getInputTypeFromMediaType(m);
    setInputType(i);
    setMediaType(m);
    setUpdated(value);
    setInput(value?.src || '');
  }, [value]);

  useEffect(() => {
    if (!initial.current) {
      setInput('');
      initial.current = false;
    }
  }, [mediaType, value]);

  useEffect(() => {
    setError('');
    const doEffect = async () => {
      if (mediaType === MEDIA_TYPES.none) {
        setUpdated(null);
        return;
      }
      try {
        const src = await getSrc(
          mediaType,
          mediaType === MEDIA_TYPES.imgUpload ? file : input,
        );
        setUpdated({
          type: mediaType === MEDIA_TYPES.youtubeUrl ? 'video' : 'image',
          src,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    doEffect();
  }, [file, input, mediaType]);

  useEffect(() => {
    onChange(updated);
  }, [updated, onChange]);

  const handleMediaTypeChange = (e) => {
    const m = e.target.value;
    setMediaType(m);
    setInputType(getInputTypeFromMediaType(m));
  };

  const handleInputChange = async (e) => {
    setInput(e.target.value);
    if (e.target.type === 'file') {
      setFile(e.target.files[0]);
    }
  };

  const togglePreview = () => {
    setPreview((p) => !p);
  };

  return (
    <>
      <FormControl mb={2} isInvalid={!!error && mediaType !== MEDIA_TYPES.none}>
        <FormLabel>Helper Image or Video</FormLabel>
        {inputType === 'file' ? (
          <Input
            type={inputType}
            isDisabled={mediaType === MEDIA_TYPES.none}
            onChange={handleInputChange}
          />
        ) : (
          <Input
            type={inputType}
            value={input ?? ''}
            placeholder={PLACEHOLDERS[mediaType]}
            isDisabled={mediaType === MEDIA_TYPES.none}
            onChange={handleInputChange}
          />
        )}
        <FormErrorMessage>
          <FormErrorIcon />
          {error}
        </FormErrorMessage>
      </FormControl>

      <SimpleGrid spacing={4} columns={{ base: 1, sm: 2 }}>
        <Select
          textTransform="capitalize"
          value={mediaType}
          onChange={handleMediaTypeChange}
        >
          {Object.values(MEDIA_TYPES).map((type) => (
            <option
              key={type}
              style={
                colorMode === 'dark'
                  ? { backgroundColor: '#2D3748', color: 'white' }
                  : {}
              }
              name="a"
              id="a"
              value={type}
            >
              {type}
            </option>
          ))}
        </Select>

        <Button
          isDisabled={mediaType === MEDIA_TYPES.none || !input}
          leftIcon={preview ? <FiEyeOff /> : <FiEye />}
          onClick={togglePreview}
        >
          Preview
        </Button>
      </SimpleGrid>

      <Collapse in={preview}>
        {!!input && (
          <URLMediaPreview
            url={updated?.src || null}
            type={updated?.type || null}
          />
        )}
      </Collapse>
    </>
  );
}

QuestionMediaInput.propTypes = {
  value: PropTypes.shape({
    type: PropTypes.oneOf(['image', 'video']),
    src: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

QuestionMediaInput.defaultProps = {
  value: null,
  onChange: () => {},
};

export default QuestionMediaInput;
