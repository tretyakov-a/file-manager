import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';
import { isFileExists } from './utils.js';

const copy = async (source, destination) => {
  if (await isFileExists(destination)) {
    throw new OperationFailedError(`copy. Reason: file already exists '${destination}'`);
  }
  try {
    await fsPromises.copyFile(source, destination);;
  } catch (err) {
    throw new OperationFailedError(`copy. Reason: ${err.message}`);
  }
}

export default copy;
