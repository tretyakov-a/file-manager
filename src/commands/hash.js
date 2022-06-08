import crypto from 'crypto';
import fs from 'fs';
import Command from './command.js';

async function hash() {
  const [ pathToFile ] = this.args;

  const hash = crypto.createHash('sha256');
  hash.setEncoding('hex');

  try {
    const readStream = fs.createReadStream(pathToFile);
    return await new Promise((resolve, reject) => {
      readStream.on('error', (err) => reject(err));
      readStream.on('end', () => {
        hash.end();
        resolve(this.onSuccess(`Hash of '${pathToFile}' is:`, hash.read()));
      })
      readStream.pipe(hash).on('error', (err) => reject(err))
    })
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'hash',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
  ],
  'Calculate hash for file and print it into console',
  hash
);
