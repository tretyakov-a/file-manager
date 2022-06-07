import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

const up = new Command('up', 0, async function() {
  const { dir } = path.parse(this.app.workingDirectory);
  try {
    await fsPromises.access(dir, fs.constants.F_OK);
    this.app.workingDirectory = dir;
    const message = msg.service(`Working directory changed to ${dir}`);
    return {  message };
  } catch (err) {
    throw new OperationFailedError(`${this.name} '${source}': ${err.message}`);
  }
})

export default up;
