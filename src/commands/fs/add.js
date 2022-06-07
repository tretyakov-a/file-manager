import fsPromises from 'fs/promises';
import path from 'path';
import Command from '../command.js';

export default new Command('add', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  let fd = null;
  try {
    fd = await fsPromises.open(source, 'wx');
    return this.onSuccess(`File successfully added ${source}`);
  } catch (err) {
    this.onError(err);
  } finally {
    if (fd) await fd.close();
  }
});
