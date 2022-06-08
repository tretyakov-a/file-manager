import fsPromises from 'fs/promises';
import Command from '../command.js';

async function cat() {
  const [ pathToFile ] = this.args;
  try {
    const data = await fsPromises.readFile(pathToFile, 'utf8');
    return this.onSuccess(`Content of '${pathToFile}':`, data);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'cat',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
  ],
  'Read file and print it\'s content in console',
  cat
);
