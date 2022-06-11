import Command from '../command.js';
import archive from './archive.js';

async function decompress() {
  const [ pathToFile, pathToNewDestination ] = this.args;
  try {
    await archive(pathToFile, pathToNewDestination, this.options.name);
    return this.onSuccess(`File ${pathToFile} successfully decompressed to ${pathToNewDestination}`);
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'decompress',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
    Command.createArg('pathToNewDestination', Command.ARGS.PATH),
  ],
  'Decompress file (using Brotli algorytm)',
  decompress
);
