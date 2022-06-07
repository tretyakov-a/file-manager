import fsPromises from 'fs/promises';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

const list = new Command('ls', [0, 1], async function() {
  const [ pathToDir ] = this.args;
  const { app: { workingDirectory }, name } = this;
  const source = pathToDir !== undefined
    ? path.resolve(workingDirectory, pathToDir)
    : workingDirectory;
  try {
    const filesStats = await fsPromises.readdir(source, { withFileTypes: true });
    const filesList = filesStats.map((file) => `  ${file.isFile() ? msg.file(file.name) : msg.dir(file.name)}`);
    const currentDir = msg.service(`ls '${source}/':`);
    const message = `${currentDir}\n${filesList.join('\n')}`;
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${name} '${source}': ${err.message}`);
  }
});

export default list;