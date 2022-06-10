import osNode from 'os';
import Command from '../command.js';
import { msg } from '../../appearance.js';

const KEYS = {
  EOL: '--EOL',
  CPUS: '--cpus',
  HOMEDIR: '--homedir',
  USERNAME: '--username',
  ARCHITECTURE: '--architecture',
}

const getCpusInfo = () => {
  const cpus = osNode.cpus();
  const results = cpus.map(({ model, speed}, index) => {
    return `#${index + 1} ${msg.hl('Model:')} ${model}; ${msg.hl('Speed:')} ${speed / 1000}GHz`;
  });
  return `Overall amount: ${results.length}: \n${results.join('\n')}`;
}

const keysHandlers = {
  [KEYS.EOL]: () => osNode.EOL === '\n' ? '\\n' : '\\r\\n',
  [KEYS.CPUS]: getCpusInfo,
  [KEYS.HOMEDIR]: () => osNode.userInfo().homedir,
  [KEYS.USERNAME]: () => osNode.userInfo().username,
  [KEYS.ARCHITECTURE]: () => osNode.platform(),
};

async function os() {
  const [ key ] = this.args;
  try {
    const data = await keysHandlers[key].call(null);
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
  ${KEYS.EOL} - Get EOL (default system End-Of-Line)
  ${KEYS.CPUS} - Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
  ${KEYS.HOMEDIR} - Get home directory
  ${KEYS.USERNAME} - Get current system user name (Do not confuse with the username that is set when the application starts)
  ${KEYS.ARCHITECTURE} - Get CPU architecture for which Node.js binary has compiled`,
  os,
  Object.values(KEYS),
);
