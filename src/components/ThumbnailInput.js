import {
  AspectRatio,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import uploadImage from '../utils/uploadImage';
import QuizPlaceholderImage from './QuizPlaceholderImage';
import ResponsiveButtonIcon from './ResponsiveButtonIcon';

function ThumbnailInput({ defaultValue, value, onThumbnailChange }) {
  const toast = useToast();

  const [thumbnailInput, setThumbnailInput] = useState('');
  const [thumbnailSrc, setThumbnailSrc] = useState(defaultValue);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setThumbnailSrc(value);
  }, [value]);

  const handleThumbnailChange = async (e) => {
    setThumbnailInput(e.target.value);

    // No files selected
    if (e.target.files.length === 0) return;

    const file = e.target.files[0];
    try {
      const uri = await uploadImage(file);
      setThumbnailSrc(uri);
      onThumbnailChange(uri);
    } catch (err) {
      toast({
        title: 'Thumbnail Upload Error',
        description:
          'An error occurred while uploading your new thumbnail image.',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
    }
  };

  const resetThumbnail = () => {
    setThumbnailInput('');
    setThumbnailSrc(defaultValue);
  };

  const togglePreview = () => {
    setPreview((p) => !p);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Thumbnail</FormLabel>
        <Flex w="100%">
          <InputGroup flexGrow="1">
            <Input
              type="file"
              value={thumbnailInput}
              onChange={handleThumbnailChange}
              paddingRight="4.5rem"
              borderTopRightRadius="none"
              borderBottomRightRadius="none"
            />
            <InputRightElement width="4.5rem">
              <Button
                size="sm"
                height="1.75rem"
                isDisabled={thumbnailSrc === defaultValue || !thumbnailInput}
                onClick={resetThumbnail}
              >
                Reset
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            px={{ base: 4, sm: 8 }}
            borderTopLeftRadius="none"
            borderBottomLeftRadius="none"
            onClick={togglePreview}
          >
            <ResponsiveButtonIcon
              icon={preview ? FiEyeOff : FiEye}
            />
            <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
              {preview ? 'Hide' : 'Show'}
              {' '}
              Preview
            </Text>
          </Button>
        </Flex>
      </FormControl>

      <Collapse mt={4} in={preview}>
        {!thumbnailSrc && (
        <Text mb={2} textAlign="center">
          This quiz doesn&apos;t have a thumbnail yet, so here&apos;s the placeholder image.
        </Text>
        )}
        <AspectRatio mx="auto" width="17rem" ratio={1}>
          {thumbnailSrc ? <Image objectFit="contain" width="100%" src={thumbnailSrc} /> : (
            <>
              <QuizPlaceholderImage />
            </>
          )}
        </AspectRatio>
      </Collapse>
    </>
  );
}

ThumbnailInput.defaultProps = {
  onThumbnailChange: () => {},
  value: null,
};

ThumbnailInput.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  value: PropTypes.string,
  onThumbnailChange: PropTypes.func,
};

export default ThumbnailInput;
