import myFs from './fs/index.js';
import nwd from './nwd/index.js';
import myOs from './os.js';
import hash from './hash.js';
import archive from './archive/index.js';
import { options as help }  from './help.js';
import exit from './exit.js';

const commands = {
  myFs, nwd, myOs, hash, archive, help, exit,
};

const getCommands = (cmds) => {
  if (cmds.handler !== undefined) {
    return [ cmds ];
  }
  return Object.keys(cmds).reduce((acc, key) => {
    return [ ...acc, ...getCommands(cmds[key]) ];
  }, []);
}

export default getCommands(commands);
