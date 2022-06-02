import { OperationFailedError } from '../errors.js';
import crypto from 'crypto';
import fs from 'fs';

const hash = async (source) => {
  const hash = crypto.createHash('sha256');
  hash.setEncoding('hex');

  try {
    const readStream = fs.createReadStream(source);
    return await new Promise((resolve, reject) => {
      readStream.on('error', (err) => reject(err));
      readStream.on('end', () => {
        hash.end();
        resolve(hash.read());
      })
      readStream.pipe(hash).on('error', (err) => reject(err))
    })
  } catch (err) {
    throw new OperationFailedError(`hash. Reason: ${err.message}`);
  }
}

export default hash;
