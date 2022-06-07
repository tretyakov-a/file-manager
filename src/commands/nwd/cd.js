import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import Command from '../command.js';

export default new Command('cd', 1, async function() {
  const [ pathToDir ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToDir);
  try {
    await fsPromises.access(source, fs.constants.F_OK);
    this.app.workingDirectory = source;
    return this.onSuccess(`Working directory changed to ${source}`);
  } catch (err) {
    this.onError(err);
  }
});
