import fsPromises from 'fs/promises';
import fs from 'fs';
import Command from '../command.js';
import { isDirectory } from '../utils.js';

async function cd() {
  const [ pathToDirectory ] = this.args;

  try {
    await fsPromises.access(pathToDirectory, fs.constants.F_OK);
    if (!(await isDirectory(pathToDirectory))) {
      throw new Error(`${pathToDirectory} is not directory`);
    }
    this.app.workingDirectory = pathToDirectory;
    return this.onSuccess(`Working directory changed to ${pathToDirectory}`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'cd',
  [
    Command.createArg('pathToDirectory', Command.ARGS.PATH),
  ],
  'Go to dedicated folder from current directory (path_to_directory can be relative or absolute)',
  cd
);
