import path from 'path';
import { InvalidInputError, OperationFailedError, InvalidKeyError } from '../errors.js';
import { msg } from '../appearance.js';
import { toSnakeCase } from './utils.js';

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
    if (err instanceof InvalidInputError || err instanceof InvalidKeyError) {
      this.app.output.write(`${this.getCommandInfo()}\n`);
    }
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
      this.onError(new InvalidInputError(name, this.args));
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
      case Command.ARGS.KEY: return this.processKey(argValue);
      default: return argValue;
    }
  }

  processKey(value) {
    if (!this.options.keys.includes(value)) {
      this.onError(new InvalidKeyError(value));
    }
    return value;
  }

  processPath(value) {
    const { app: { workingDirectory } } = this;
    return value !== undefined
      ? path.resolve(workingDirectory, value)
      : workingDirectory;
  }

  processDirPath(value, prevValue) {
    const { base } = path.parse(prevValue);
    return path.resolve(this.app.workingDirectory, value, base); 
  }

  processName(value, prevValue) {
    const resolvedFilePath = path.resolve(this.app.workingDirectory, prevValue);
    return path.resolve(path.parse(resolvedFilePath).dir, value);
  }

  getCommandInfo = () => {
    const { name, argsConfig, description } = this.options;
    const nameOutput = msg.dir(`${name} `);
    const argsOutput = argsConfig.length !== 0
      ? msg.hl(argsConfig.map(({ name }) => `<${toSnakeCase(name)}> `).join(''))
      : '';
    return `${nameOutput}${argsOutput}${description}`;
  }
  
}

Command.createOptions = function(name, argsConfig, description, handler, keys = []) {
  return {
    name, argsConfig, description, handler, keys,
  }
}

Command.createArg = function(name, type, required = true) {
  return {
    name, type, required,
  }
}

Command.ARGS = {
  PATH: 'path',
  DIR_PATH: 'dirPath',
  KEY: 'key',
  NAME: 'name',
};
