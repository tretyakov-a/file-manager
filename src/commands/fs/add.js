import fsPromises from 'fs/promises';
import path from 'path';
import { OperationFailedError } from '../../errors.js';
import { msg } from '../../appearance.js';
import Command from '../command.js';

export default new Command('add', 1, async function() {
  const [ pathToFile ] = this.args;
  const source = path.resolve(this.app.workingDirectory, pathToFile);
  let fd = null;
  try {
    fd = await fsPromises.open(source, 'wx');

    // some content in new file for testing
    await fd.write(Buffer.from('Hello world!'));

    const message = msg.service(`File successfully added ${source}`);
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name} '${source}'. Reason: ${err.message}`);
  } finally {
    if (fd) await fd.close();
  }
});
