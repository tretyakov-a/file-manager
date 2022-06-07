import Command from '../command.js';
import archive from './archive.js';

export default new Command('decompress', 2, async function() {
  const [ pathToFile, pathToNewDestination ] = this.args;
  try {
    const [source, destination] =  await archive(pathToFile, pathToNewDestination, this.app.workingDirectory, this.name);
    return this.onSuccess(`File ${source} successfully decompressed to ${destination}`);
  } catch (err) {
    this.onError(err);
  }
});
