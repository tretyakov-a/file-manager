
class OperationFailedError extends Error {
  constructor(operation, reason) {
    super(`Operation failed: ${operation}. Reason: ${reason.message}`);
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
    super(`Invalid argument: '${arg}': supported arguments list: --username=<value>`);
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

const errors = {
  OperationFailedError,
  InvalidInputError,
  InvalidArgumentError,
  InvalidKeyError,
};

const isCustomError = (errorName) => {
  return Object.keys(errors).find((name) => name === errorName);
}

export {
  OperationFailedError,
  InvalidInputError,
  InvalidArgumentError,
  InvalidKeyError,
  isCustomError,
};
