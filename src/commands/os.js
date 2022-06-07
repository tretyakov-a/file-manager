import osNode from 'os';
import { OperationFailedError } from '../errors.js';
import { msg } from '../appearance.js';
import Command from './command.js';

const getCpusInfo = () => {
  const cpus = osNode.cpus();
  const results = cpus.map(({ model, speed}, index) => {
    return `#${index + 1} ${model}; Speed: ${speed / 1000}GHz`;
  });
  return `Overall amount: ${results.length}: \n${results.join('\n')}`;
}

const keys = {
  '--EOL': () => osNode.EOL === '\n' ? '\\n' : '\\r\\n',
  '--cpus': getCpusInfo,
  '--homedir': () => osNode.userInfo().homedir,
  '--username': () => osNode.userInfo().username,
  '--architecture': () => osNode.platform(),
};

const os = new Command('os', 1, async function() {
  const [ key ] = this.args;
  if (!keys[key]) {
    throw new OperationFailedError(`${this.name}. Reason: invalid key '${key}'`);
  }
  try {
    const message = msg.dir(await keys[key].call(null));
    return { message };
  } catch (err) {
    throw new OperationFailedError(`${this.name}. Reason: ${err.message}`);
  }
});

export default os;
