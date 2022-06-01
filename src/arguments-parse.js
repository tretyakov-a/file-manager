function findName(argName, config) {
  return Object.keys(config).find((key) => config[key].startsWith(argName));
}

export default function parseArguments(args, config) {
  return args.reduce((argValues, arg) => {
    const [ argName, value ] = arg.split('=');
    const name = findName(argName.trim(), config);
    if (!name || value === undefined) {
      throw new Error(`Incorrect command '${argName}': you should use --username=user_name`);
    }
    return { ...argValues, [name]: value };
  }, {})
}
