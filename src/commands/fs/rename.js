import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';
import { isFileExists } from './utils.js';

const rename = async (source, destination) => {
  if (await isFileExists(destination)) {
    throw new OperationFailedError(`rename. Reason: file already exists '${destination}'`);
  }
  try {
    await fsPromises.rename(source, destination);
  } catch (err) {
    throw new OperationFailedError(`rename. Reason: ${err.message}`);
  }
}

export default rename;
