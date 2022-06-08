import Command from './command.js';
import commandsInfo from './index.js';

async function help() {
  const data = commandsInfo.map(Command.printCommandInfo);
  return this.onSuccess(undefined, data.join('\n'));
}

export const options = Command.createOptions(
  'help',
  [],
  'Print help',
  help
);