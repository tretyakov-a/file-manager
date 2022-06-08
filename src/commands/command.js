import path from 'path';
import { InvalidInputError, OperationFailedError } from '../errors.js';
import { msg } from '../appearance.js';
import { toSnakeCase } from './fs/utils.js';

export default class Command {
  constructor(options, app) {
    this.options = options;

    this.app = app;
    this.requiredArgsNumber = {
      min: this.options.argsConfig.reduce((acc, arg) => acc + arg.required, 0),
      max: this.options.argsConfig.length,
    };
  }

  run(args = []) {
    this.args = args;
    this.checkArgs();

    return this.options.handler.call(this);
  }

  onSuccess(message, data) {
    const outputMessage = message && msg.service(message);
    return { message: outputMessage, data };
  }

  onError(err) {
    throw new OperationFailedError(this.options.name, err);
  }

  checkArgs() {
    const {
      args: { length },
      options: { argsConfig, name },
      requiredArgsNumber: { min, max },
    } = this;
    const isArgsNumberValid = length >= min && length <= max;
    if (!isArgsNumberValid) {
      process.stdout.write(`${Command.printCommandInfo(this.options)}\n`);
      throw new InvalidInputError(name);
    }
    this.args = argsConfig.map(this.processArg);
    return true;
  }

  processArg = (arg, i) => {
    const argValue = this.args[i];
    const prevArgValue = this.args[i - 1];
    switch(arg.type) {
      case Command.ARGS.PATH: return this.processPath(argValue);
      case Command.ARGS.DIR_PATH: return this.processDirPath(argValue, prevArgValue);
      case Command.ARGS.NAME: return this.processName(argValue, prevArgValue);
      default: return argValue;
    }
  }

  processPath(value) {
    const { app: { workingDirectory } } = this;
    return value !== undefined
      ? path.resolve(workingDirectory, value)
      : workingDirectory;
  }

  processDirPath(value, prevValue) {
    return path.resolve(this.app.workingDirectory, value, prevValue); 
  }

  processName(value, prevValue) {
    const resolvedFilePath = path.resolve(this.app.workingDirectory, prevValue);
    return path.resolve(path.parse(resolvedFilePath).dir, value);
  }
}

Command.createOptions = function(name, argsConfig, description, handler) {
  return {
    name, argsConfig, description, handler,
  }
}

Command.createArg = function(name, type, required = true) {
  return {
    name, type, required,
  }
}

Command.printCommandInfo = ({ name, argsConfig, description }) => {
  const nameOutput = msg.dir(`${name} `);
  const argsOutput = argsConfig.length !== 0
    ? msg.hl(argsConfig.map(({ name }) => `<${toSnakeCase(name)}> `).join(''))
    : '';
  return `${nameOutput}${argsOutput}${description}`;
}

Command.ARGS = {
  PATH: 'path',
  DIR_PATH: 'dirPath',
  KEY: 'key',
  NAME: 'name',
};
