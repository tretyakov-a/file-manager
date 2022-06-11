import fsPromises from 'fs/promises';
import path from 'path';
import { msg } from '../../appearance.js';
import Command from '../command.js';

const adjustFileSize = (size, maxLen = 7) => {
  let output = String(size);
  if (output.length > maxLen - 1) {
    output = `${Math.trunc(size / 1000000)}M`;
  }
  return ' '.repeat(maxLen - output.length) + output;
};

async function list() {
  const [ pathToDirectory ] = this.args;

  try {
    const files = await fsPromises.readdir(pathToDirectory, { withFileTypes: true });
    const filesStats = await Promise.all(files.map(({ name }) => {
      const pathToFile = path.join(pathToDirectory, name);
      return fsPromises.stat(pathToFile);
    }));
    const filesOutputList = files.map((file, i) => {
      const name = `${file.isFile() ? msg.file(file.name) : msg.dir(file.name)}`;
      const sizeOutput = adjustFileSize(filesStats[i].size);
      return `${msg.hl(sizeOutput)}  ${name}`;
    });
    const data = `${filesOutputList.join('\n')}`;
    return this.onSuccess(undefined, data);
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
