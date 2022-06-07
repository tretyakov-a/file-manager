import fsPromises from 'fs/promises';
import path from 'path';
import { isFileExists } from './utils.js';
import Command from '../command.js';

export default new Command('rn', 2, async function() {
  const [ pathToFile, newFileName ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  const destination = path.resolve(path.parse(source).dir, newFileName); 

  if (await isFileExists(destination)) {
    this.onError(new Error(`File already exists '${destination}'`));
  }
  try {
    await fsPromises.rename(source, destination);
    return this.onSuccess(`File ${source} successfully renamed to ${destination}`);
  } catch (err) {
    this.onError(err);
  }
});
