import { OperationFailedError } from '../errors.js';
import osNode from 'os';

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

const os = async (key) => {
  if (!keys[key]) {
    throw new OperationFailedError(`os. Reason: invalid key '${key}'`);
  }
  try {
    return await keys[key].call(null);
  } catch (err) {
    throw new OperationFailedError(`os. Reason: ${err.message}`);
  }
}

export default os;
