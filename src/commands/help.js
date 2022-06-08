import Command from './command.js';
import commandsInfo from './index.js';
import { msg } from '../appearance.js';

const toSnakeCase = (str) => {
  let result = '';
  for (const c of str) {
    if (c === c.toUpperCase()) {
      result += '_';
    }
    result += c.toLowerCase();
  }
  return result;
};

export const toCommandInfo = ({ name, argsConfig, description }) => {
  const nameOutput = msg.dir(`${name} `);
  const argsOutput = argsConfig.length !== 0
    ? msg.hl(argsConfig.map(({ name }) => `<${toSnakeCase(name)}> `).join(''))
    : '';
  return `${nameOutput}${argsOutput}${description}`;
}

async function help() {
  const data = commandsInfo.map(toCommandInfo);
  return this.onSuccess(undefined, data.join('\n'));
}

export const options = Command.createOptions(
  'help',
  [],
  'Print help',
  help
);