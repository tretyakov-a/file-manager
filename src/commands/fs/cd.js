import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';
import fs from 'fs';

const cd = async (source) => {
  try {
    await fsPromises.access(source, fs.constants.F_OK);
    return true;
  } catch (err) {
    throw new OperationFailedError(`cd '${source}': ${err.message}`);
  }
}

export default cd;
