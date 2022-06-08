import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import Command from '../command.js';

async function up() {
  const { dir } = path.parse(this.app.workingDirectory);
  try {
    await fsPromises.access(dir, fs.constants.F_OK);
    this.app.workingDirectory = dir;
    return this.onSuccess(`Working directory changed to ${dir}`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'up',
  [],
  'Go upper from current directory (when you are in the root folder this operation shouldn\'t change working directory)',
  up
);
