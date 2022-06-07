import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import Command from '../command.js';

export default new Command('up', 0, async function() {
  const { dir } = path.parse(this.app.workingDirectory);
  try {
    await fsPromises.access(dir, fs.constants.F_OK);
    this.app.workingDirectory = dir;
    return this.onSuccess(`Working directory changed to ${dir}`);
  } catch (err) {
    this.onError(err);
  }
});
