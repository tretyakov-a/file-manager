import fsPromises from 'fs/promises';
import Command from '../command.js';

async function add() {
  const [ pathToFile ] = this.args;
  let fd = null;
  try {
    fd = await fsPromises.open(pathToFile, 'wx');
    
    // add some content for testing
    await fd.write(`Hello world! Initial file location is ${pathToFile}\n`);

    return this.onSuccess(`File successfully added ${pathToFile}`);
  } catch (err) {
    this.onError(err);
  } finally {
    if (fd) await fd.close();
  }
}

export default Command.createOptions(
  'add',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
  ],
  'Create empty file in current working directory',
  add
);