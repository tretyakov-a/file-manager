import { InvalidArgument } from './errors.js';

function findName(argName, config) {
  return Object.keys(config).find((key) => config[key].startsWith(argName));
}

export default function parseArguments(args, config) {
  return args.reduce((argValues, arg) => {
    const [ argName, value ] = arg.split('=');
    const name = findName(argName.trim(), config);
    if (!name || value === undefined) {
      throw new InvalidArgument(argName, config);
    }
    return { ...argValues, [name]: value };
  }, {})
}
