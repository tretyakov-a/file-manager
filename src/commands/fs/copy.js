import fsPromises from 'fs/promises';
import path from 'path';
import { isFileExists } from './utils.js';
import { OperationFailedError } from '../../errors.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

export default new Command('cp', 2, async function() {
  const [ pathToFile, pathToNewDir ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  const destination = path.resolve(this.app.workingDirectory, pathToNewDir, pathToFile); 

  if (await isFileExists(destination)) {
    throw new OperationFailedError(`${this.name}. Reason: file already exists '${destination}'`);
  }
  try {
    await fsPromises.copyFile(source, destination);
    const message = msg.service(`File ${source} successfully copied to ${destination}`);
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name}. Reason: ${err.message}`);
  }
});

