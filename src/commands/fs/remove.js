import fsPromises from 'fs/promises';
import path from 'path';
import Command from '../command.js';

export default new Command('rm', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile); 
  try {
    await fsPromises.rm(source);
    return this.onSuccess(`File ${source} successfully removed`);
  } catch (err) {
    this.onError(err);
  }
});
