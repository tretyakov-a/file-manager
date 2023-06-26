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

const toOutputString = (filesStats) => (file) => {
  const isDir = file.isDirectory();
  const name = `${isDir ? msg.dir(file.name) : msg.file(file.name)}`;
  const sizeOutput = adjustFileSize(filesStats.size);
  const output = [
    msg.hl(sizeOutput), name
  ]
  return output.join(' ');
}

async function list() {
  const [ pathToDirectory ] = this.args;

  const files = await fsPromises.readdir(pathToDirectory, { withFileTypes: true });

  const filesStats = await Promise.all(files.map(({ name }) => {
    const pathToFile = path.join(pathToDirectory, name);
    return fsPromises.stat(pathToFile);
  }));


  const allOutput = files
    .map((file, i) => ([file.isDirectory(), toOutputString(filesStats[i])(file)]))
    .sort(([isDirA], [isDirB]) => isDirB - isDirA);

  return [undefined, allOutput.map(([, output]) => output).join('\n')];
}

export default Command.createOptions(
  'ls',
  [
    Command.createArg('pathToDirectory', Command.ARG_TYPE.PATH, false),
  ],
  'List all files and folder in current directory and print it to console',
  list
);
