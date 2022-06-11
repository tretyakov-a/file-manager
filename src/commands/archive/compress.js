import Command from '../command.js';
import archive from './archive.js';

async function compress() {
  const [ pathToFile, pathToNewDestination ] = this.args;
  try {
    await archive(pathToFile, pathToNewDestination, this.options.name);
    return this.onSuccess(`File ${pathToFile} successfully compressed to ${pathToNewDestination}`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'compress',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
    Command.createArg('pathToNewDestination', Command.ARGS.PATH),
  ],
  'Compress file (using Brotli algorytm)',
  compress
);

