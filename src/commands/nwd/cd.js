import fsPromises from 'fs/promises';
import fs from 'fs';
import Command from '../command.js';

async function cd() {
  const [ pathToDirectory ] = this.args;

  try {
    await fsPromises.access(pathToDirectory, fs.constants.F_OK);
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
