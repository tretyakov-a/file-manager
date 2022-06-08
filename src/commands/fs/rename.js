import fsPromises from 'fs/promises';
import { isFileExists } from './utils.js';
import Command from '../command.js';

async function rename() {
  const [ pathToFile, newFileName ] = this.args;

  if (await isFileExists(newFileName)) {
    this.onError(new Error(`File already exists '${newFileName}'`));
  }
  try {
    await fsPromises.rename(pathToFile, newFileName);
    return this.onSuccess(`File ${pathToFile} successfully renamed to ${newFileName}`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'rn',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
    Command.createArg('newFileName', Command.ARGS.NAME),
  ],
  'Rename file',
  rename
);