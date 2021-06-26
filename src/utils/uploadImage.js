import isValidImageType, { validFileTypes } from './isValidImageType';

// Given an input element of type=file, grab the data uploaded for use
const uploadImage = (file) => new Promise((resolve, reject) => {
  if (!file || !file.type) {
    return reject(
      new Error('No image file selected'),
    );
  }

  const valid = isValidImageType(file.type);

  // bad data, let's walk away
  if (!valid) {
    return reject(
      new Error(`Image must have type: ${validFileTypes.join(', ')}`),
    );
  }

  // if we get here we have a valid image
  const reader = new FileReader();

  reader.onload = (event) => {
    resolve(event.target.result);
  };

  reader.onerror = () => {
    reject(new Error('There was an issue uploading your image. Try again later.'));
  };

  // this returns a base64 image
  reader.readAsDataURL(file);

  return null;
});

export default uploadImage;
