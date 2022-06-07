import fsPromises from 'fs/promises';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { isFileExists } from './utils.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

export default new Command('mv', 2, async function () {
  const [ pathToFile, pathToNewDir ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  const destination = path.resolve(this.app.workingDirectory, pathToNewDir, pathToFile); 

  if (await isFileExists(destination)) {
    throw new OperationFailedError(`${this.name}. Reason: file already exists '${destination}'`);
  }
  try {
    await fsPromises.copyFile(source, destination);
    if (source !== destination) {
      await fsPromises.rm(source);
    }
    const message = msg.service(`File ${source} successfully moved to ${destination}`);
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name}. Reason: ${err.message}`);
  }
});

