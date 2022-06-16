import fsPromises from 'fs/promises';
import { copyFile } from '../utils.js';
import Command from '../command.js';

async function move() {
  const [ pathToFile, pathToNewDirectory ] = this.args;
  await copyFile(pathToFile, pathToNewDirectory);
  await fsPromises.rm(pathToFile);
  return [`File '${pathToFile}' successfully moved to '${pathToNewDirectory}'`];
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
