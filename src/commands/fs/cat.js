import Command from '../command.js';
import { createReadStream } from '../fs/utils.js';

async function cat() {
  const [ pathToFile ] = this.args;

  try {
    const readStream = await createReadStream(pathToFile);

    await new Promise((resolve, reject) => {
      readStream.on('end', () => {
        process.stdout.write('\n');
        resolve();
      });
      readStream.pipe(process.stdout, { end: false })
        .on('error', reject);
    });

    return this.onSuccess();
  } catch (err) {
    this.onError(err);
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
