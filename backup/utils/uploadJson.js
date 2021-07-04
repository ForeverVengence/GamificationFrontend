const uploadJson = (file) => new Promise((resolve, reject) => {
  if (!file || !file.type) {
    return reject(
      new Error('No image file selected'),
    );
  }

  // bad data, let's walk away
  if (file.type !== 'application/json') {
    return reject(
      new Error('Uploaded file was not a JSON file.'),
    );
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    resolve(JSON.parse(event.target.result));
  };

  reader.onerror = () => {
    reject(new Error('There was an issue importing your quiz. Try again later.'));
  };

  reader.readAsText(file);

  return null;
});

export default uploadJson;
