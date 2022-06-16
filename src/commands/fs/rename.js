import fsPromises from 'fs/promises';
import { isFileExists } from '../utils.js';
import Command from '../command.js';

async function rename() {
  const [ pathToFile, newFileName ] = this.args;
  if (await isFileExists(newFileName)) {
    throw new Error(`File already exists '${newFileName}'`);
  }
  await fsPromises.rename(pathToFile, newFileName);
  return [`File ${pathToFile} successfully renamed to ${newFileName}`];
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