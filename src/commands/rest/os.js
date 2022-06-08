import osNode from 'os';
import Command from '../command.js';

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

async function os() {
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
}

export default Command.createOptions(
  'os',
  [
    Command.createArg('key', Command.ARGS.KEY),
  ],
  `Operating system info (prints following information in console)
  --EOL - Get EOL (default system End-Of-Line)
  --cpus - Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
  --homedir - Get home directory
  --username - Get current system user name (Do not confuse with the username that is set when the application starts)
  --architecture - Get CPU architecture for which Node.js binary has compiled`,
  os
);
