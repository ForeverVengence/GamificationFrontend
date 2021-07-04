export const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/tiff', 'image/gif'];

function isValidImageType(type) {
  return validFileTypes.includes(type);
}

export default isValidImageType;
