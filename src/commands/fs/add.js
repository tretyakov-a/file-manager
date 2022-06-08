import Command from '../command.js';
import { createWriteStream } from '../fs/utils.js';

async function add() {
  const [ pathToFile ] = this.args;
  let writeStream;
  try {
    writeStream = await createWriteStream(pathToFile);  

    // add some content for testing
    await new Promise((resolve, reject) => {
      writeStream.write(`Hello world! Initial file location is ${pathToFile}\n`, (err) => {
        if (err) reject(err);
        resolve();
      });
    })
    return this.onSuccess(`File successfully added ${pathToFile}`);
  } catch (err) {
    this.onError(err);
  } finally {
    if (writeStream) writeStream.close();
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