import fsPromises from 'fs/promises';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

const remove = new Command('rm', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile); 
  try {
    await fsPromises.rm(source);
    const message = msg.service(`File ${source} successfully removed`);
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name}. Reason: ${err.message}`);
  }
});

export default remove;
