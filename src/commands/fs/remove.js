import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';

const copy = async (source) => {
  try {
    await fsPromises.rm(source);;
  } catch (err) {
    throw new OperationFailedError(`remove. Reason: ${err.message}`);
  }
}

export default copy;
