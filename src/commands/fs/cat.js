import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';

const cat = async (source) => {
  try {
    return await fsPromises.readFile(source, 'utf8');
  } catch (err) {
    throw new OperationFailedError(`cat '${source}': ${err.message}`);
  }
}

export default cat;
