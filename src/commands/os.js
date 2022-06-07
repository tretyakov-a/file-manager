import osNode from 'os';
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

export default new Command('os', 1, async function() {
  const [ key ] = this.args;
  if (!keys[key]) {
    this.onError(new Error(`invalid key '${key}'`));
  }
  try {
    const data = await keys[key].call(null);
    return this.onSuccess(undefined, data);
  } catch (err) {
    this.onError(err);
  }
});
