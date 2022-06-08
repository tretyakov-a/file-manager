import fsPromises from 'fs/promises';
import Command from '../command.js';

async function remove() {
  const [ pathToFile ] = this.args;

  try {
    await fsPromises.rm(pathToFile);
    return this.onSuccess(`File ${pathToFile} successfully removed`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'rm',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
  ],
  'Delete file',
  remove
);
