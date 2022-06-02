import { OperationFailedError } from '../../errors.js';
import fsPromises from 'fs/promises';

const add = async (source) => {
  let fd = null;
  try {
    fd = await fsPromises.open(source, 'wx');
    return true;
  } catch (err) {
    throw new OperationFailedError(`add '${source}'. Reason: ${err.message}`);
  } finally {
    if (fd) await fd.close();
  }
}

export default add;
