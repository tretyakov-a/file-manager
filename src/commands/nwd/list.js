import fsPromises from 'fs/promises';
import { msg } from '../../appearance.js';
import Command from '../command.js';

async function list() {
  const [ pathToDirectory ] = this.args;

  try {
    const filesStats = await fsPromises.readdir(pathToDirectory, { withFileTypes: true });
    const filesList = filesStats.map((file) => `  ${file.isFile() ? msg.file(file.name) : msg.dir(file.name)}`);
    const data = `${filesList.join('\n')}`;
    return this.onSuccess(`ls '${pathToDirectory}/':`, data);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'ls',
  [
    Command.createArg('pathToDirectory', Command.ARGS.PATH, false),
  ],
  'List all files and folder in current directory and print it to console',
  list
);
