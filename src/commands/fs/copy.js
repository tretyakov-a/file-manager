import fsPromises from 'fs/promises';
import { isFileExists } from './utils.js';
import Command from '../command.js';

async function copy() {
  const [ pathToFile, pathToNewDirectory ] = this.args;

  if (await isFileExists(pathToNewDirectory)) {
    this.onError(new Error(`File already exists '${pathToNewDirectory}'`));
  }
  try {
    await fsPromises.copyFile(pathToFile, pathToNewDirectory);
    return this.onSuccess(`File '${pathToFile}' successfully copied to '${pathToNewDirectory}'`)
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'cp',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
    Command.createArg('pathToNewDirectory', Command.ARGS.DIR_PATH),
  ],
  'Copy file',
  copy
);
