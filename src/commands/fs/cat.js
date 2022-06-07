import fsPromises from 'fs/promises';
import path from 'path';
import Command from '../command.js';

export default new Command('cat', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  try {
    const data = await fsPromises.readFile(source, 'utf8');
    return this.onSuccess(`Content of '${pathToFile}':`, data);
  } catch (err) {
    this.onError(err);
  }
});
