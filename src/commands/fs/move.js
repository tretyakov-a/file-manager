import fsPromises from 'fs/promises';
import { isFileExists } from './utils.js';
import Command from '../command.js';

async function move() {
  const [ pathToFile, pathToNewDirectory ] = this.args;

  if (await isFileExists(pathToNewDirectory)) {
    this.onError(new Error(`File already exists '${pathToNewDirectory}'`));
  }
  try {
    await fsPromises.copyFile(pathToFile, pathToNewDirectory);
    if (pathToFile !== pathToNewDirectory) {
      await fsPromises.rm(pathToFile);
    }
    return this.onSuccess(`File '${pathToFile}' successfully moved to '${pathToNewDirectory}'`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'mv',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
    Command.createArg('pathToNewDirectory', Command.ARGS.DIR_PATH),
  ],
  'Move file (same as copy but initial file is deleted)',
  move
);
