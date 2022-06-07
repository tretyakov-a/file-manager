import fsPromises from 'fs/promises';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { isFileExists } from './utils.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

const rename = new Command('rn', 2, async function() {
  const [ pathToFile, newFileName ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  const destination = path.resolve(path.parse(source).dir, newFileName); 

  if (await isFileExists(destination)) {
    throw new OperationFailedError(`${this.name}. Reason: file already exists '${destination}'`);
  }
  try {
    await fsPromises.rename(source, destination);
    const message = msg.service(`File ${source} successfully renamed to ${destination}`);
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name}. Reason: ${err.message}`);
  }
});

export default rename;
