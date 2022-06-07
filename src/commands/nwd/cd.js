import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

const cd = new Command('cd', 1, async function() {
  const [ pathToDir ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToDir);
  try {
    await fsPromises.access(source, fs.constants.F_OK);
    this.app.workingDirectory = source;
    const message = msg.service(`Working directory changed to ${source}`);
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name} '${source}': ${err.message}`);
  }
})

export default cd;
