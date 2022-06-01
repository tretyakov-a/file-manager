import { OperationFailed } from '../../errors.js';
import fsPromises from 'fs/promises';

const list = async (source) => {
  try {
    const filesStats = await fsPromises.readdir(source, { withFileTypes: true });
    return filesStats;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new OperationFailed(`list ${source}`);
    }
    console.error(err);
  }
}

export default list;