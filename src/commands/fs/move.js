import fsPromises from 'fs/promises';
import path from 'path';
import { isFileExists } from './utils.js';
import Command from '../command.js';

export default new Command('mv', 2, async function () {
  const [ pathToFile, pathToNewDir ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  const destination = path.resolve(this.app.workingDirectory, pathToNewDir, pathToFile); 

  if (await isFileExists(destination)) {
    this.onError(new Error(`File already exists '${destination}'`));
  }
  try {
    await fsPromises.copyFile(source, destination);
    if (source !== destination) {
      await fsPromises.rm(source);
    }
    return this.onSuccess(`File '${source}' successfully moved to '${destination}'`);
  } catch (err) {
    this.onError(err);
  }
});

