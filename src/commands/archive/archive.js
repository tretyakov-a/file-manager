import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { isFileExists } from '../fs/utils.js';

const archive = async (pathToFile, pathToNewDestination, workingDirectory, command) => {
  const source = path.resolve(workingDirectory, pathToFile);
  const destination = path.resolve(workingDirectory, pathToNewDestination);
  if (await isFileExists(destination)) {
    throw new Error(`File already exists '${destination}'`);
  }
  try {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    const transform = command === 'compress'
      ? createBrotliCompress()
      : createBrotliDecompress();
    await pipeline(readStream, transform, writeStream);
    return [source, destination];
  } catch (err) {
    throw err;
  }
};

export default archive;
