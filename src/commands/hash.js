import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import Command from './command.js';

export default new Command('hash', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile); 
  const hash = crypto.createHash('sha256');
  hash.setEncoding('hex');

  try {
    const readStream = fs.createReadStream(source);
    return await new Promise((resolve, reject) => {
      readStream.on('error', (err) => reject(err));
      readStream.on('end', () => {
        hash.end();
        resolve(this.onSuccess(`Hash of '${source}' is:`, hash.read()));
      })
      readStream.pipe(hash).on('error', (err) => reject(err))
    })
  } catch (err) {
    this.onError(err);
  }
});
