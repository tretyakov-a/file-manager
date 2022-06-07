import fsPromises from 'fs/promises';
import path from 'path';
import { msg } from '../../appearance.js';
import Command from '../command.js';

export default new Command('ls', [0, 1], async function() {
  const [ pathToDir ] = this.args;
  const { app: { workingDirectory }, name } = this;
  const source = pathToDir !== undefined
    ? path.resolve(workingDirectory, pathToDir)
    : workingDirectory;
  try {
    const filesStats = await fsPromises.readdir(source, { withFileTypes: true });
    const filesList = filesStats.map((file) => `  ${file.isFile() ? msg.file(file.name) : msg.dir(file.name)}`);
    const data = `${filesList.join('\n')}`;
    return this.onSuccess(`ls '${source}/':`, data);
  } catch (err) {
    this.onError(err);
  }
});
