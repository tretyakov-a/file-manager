import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { isFileExists } from '../fs/utils.js';

const archive = async (pathToFile, pathToNewDestination, command) => {
  if (await isFileExists(pathToNewDestination)) {
    throw new Error(`File already exists '${pathToNewDestination}'`);
  }
  try {
    const readStream = fs.createReadStream(pathToFile);
    const writeStream = fs.createWriteStream(pathToNewDestination);
    const transform = command === 'compress'
      ? createBrotliCompress()
      : createBrotliDecompress();
    await pipeline(readStream, transform, writeStream);
  } catch (err) {
    throw err;
  }
};

export default archive;
