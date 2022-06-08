import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from '../fs/utils.js';

const archive = async (pathToFile, pathToNewDestination, command) => {
  try {
    const readStream = await createReadStream(pathToFile);
    const writeStream = await createWriteStream(pathToNewDestination);
    const transform = command === 'compress'
      ? createBrotliCompress()
      : createBrotliDecompress();
    await pipeline(readStream, transform, writeStream);
  } catch (err) {
    throw err;
  }
};

export default archive;
