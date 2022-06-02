import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';

const list = async (source) => {
  try {
    const filesStats = await fsPromises.readdir(source, { withFileTypes: true });
    return filesStats;
  } catch (err) {
    throw new OperationFailedError(`list '${source}': ${err.message}`);
  }
}

export default list;