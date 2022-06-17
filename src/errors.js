
class OperationFailedError extends Error {
  constructor(operation, reason) {
    super(`Operation failed: ${operation}. Reason: ${reason}`);
    this.operation = operation;
    this.reason = reason;
    this.name = this.constructor.name;
  }
}

class InvalidInputError extends Error {
  constructor(command, args = []) {
    super(`Invalid input: '${command}${args.length === 0 ? '' : ` ${args.join(' ')}`}'`);
    this.command = command;
    this.name = this.constructor.name;
  }
}

class InvalidArgumentError extends Error {
  constructor(arg, config) {
    const argsOutput = Object.values(config).map((argName) => `${argName}=<value>`)
    super(`Invalid argument: '${arg}': supported arguments list: ${argsOutput}`);
    this.arg = arg;
    this.name = this.constructor.name;
  }
}

class InvalidKeyError extends Error {
  constructor(key) {
    super(`Invalid key '${key}'`);
    this.key = key;
  }
}

class FileExistsError extends Error {
  constructor(pathToFile) {
    super(`File already exists '${pathToFile}'`);
    this.pathToFile = pathToFile;
  }
}

class SourceIsDirectoryError extends Error {
  constructor(source, isDirectory = true) {
    super(`Source '${source}' is${!isDirectory ? ' not ' : ' '}a directory!`);
    this.source = source;
  }
}

const errors = {
  OperationFailedError,
  InvalidInputError,
  InvalidArgumentError,
  InvalidKeyError,
  FileExistsError,
  SourceIsDirectoryError
};

const isCustomError = (errorName) => {
  return Object.keys(errors).includes(errorName);
}

export {
  OperationFailedError,
  InvalidInputError,
  InvalidArgumentError,
  InvalidKeyError,
  isCustomError,
  FileExistsError,
  SourceIsDirectoryError,
};
