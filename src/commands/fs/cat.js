import fsPromises from 'fs/promises';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import Command from '../command.js';

export default new Command('cat', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  try {
    const message = await fsPromises.readFile(source, 'utf8');
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name} '${source}': ${err.message}`);
  }
});
