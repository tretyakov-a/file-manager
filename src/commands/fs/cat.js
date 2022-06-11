import Command from '../command.js';
import { createReadStream } from '../utils.js';

async function cat() {
  const [ pathToFile ] = this.args;
  let readStream;
  try {
    readStream = await createReadStream(pathToFile);
    await new Promise((resolve, reject) => {
      readStream.on('end', () => {
        this.app.output.write('\n');
        resolve();
      });
      readStream.on('error', reject);
      readStream.pipe(this.app.output, { end: false })
        .on('error', reject);
    });

    return this.onSuccess();
  } catch (err) {
    this.onError(err);
  } finally {
    if (readStream) readStream.close();
  }
}

export default Command.createOptions(
  'cat',
  [
    Command.createArg('pathToFile', Command.ARGS.PATH),
  ],
  'Read file and print it\'s content in console',
  cat
);
