import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { OperationFailedError } from '../errors.js';

export const archive = async (source, destination, command = 'compress') => {
  try {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    const transform = command === 'compress'
      ? createBrotliCompress()
      : createBrotliDecompress();
    await pipeline(readStream, transform, writeStream);
  } catch (err) {
    throw new OperationFailedError(`os. Reason: ${err.message}`);
  }
};

export default archive;
