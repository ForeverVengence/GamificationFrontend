function getVideoIdFromUrl(url) {
  const matches = (/youtube\.com\/watch\/?\?v=(?<video>.{0,11})$/i).exec(url);
  return matches?.groups?.video;
}

export default getVideoIdFromUrl;
