import Command from '../command.js';
import archive from './archive.js';

export default new Command('compress', 2, async function() {
  const [ pathToFile, pathToNewDestination ] = this.args;
  try {
    const [source, destination] =  await archive(pathToFile, pathToNewDestination, this.app.workingDirectory, this.name);
    const message = msg.service(`File ${source} successfully compressed to ${destination}`);
    return { message };
  } catch (err) {
    throw err;
  }
});
