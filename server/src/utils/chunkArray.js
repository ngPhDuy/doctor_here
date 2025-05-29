exports.chunkArray = function (array, chunk_size) {
  const results = [];
  for (let i = 0; i < array.length; i += chunk_size) {
    results.push(array.slice(i, i + chunk_size));
  }
  return results;
};
