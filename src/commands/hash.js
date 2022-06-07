import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { OperationFailedError } from '../errors.js';
import { msg } from '../appearance.js';
import Command from './command.js';

const hash = new Command('hash', 1, async function() {
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
        const message = msg.service(`Hash of '${source}' is:\n${msg.dir(hash.read())}`);
        resolve({ message });
      })
      readStream.pipe(hash).on('error', (err) => reject(err))
    })
  } catch (err) {
    throw new OperationFailedError(`${this.name}. Reason: ${err.message}`);
  }
});

export default hash;
