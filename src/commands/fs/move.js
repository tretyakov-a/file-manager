import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';
import { isFileExists } from './utils.js';

const copy = async (source, destination) => {
  if (await isFileExists(destination)) {
    throw new OperationFailedError(`move. Reason: file already exists '${destination}'`);
  }
  try {
    await fsPromises.copyFile(source, destination);
    if (source !== destination) {
      await fsPromises.rm(source);
    }
  } catch (err) {
    throw new OperationFailedError(`move. Reason: ${err.message}`);
  }
}

export default copy;
