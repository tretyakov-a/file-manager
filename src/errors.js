
class OperationFailedError extends Error {
  constructor(operation) {
    super(`Operation failed ${operation}`);
    this.operation = operation;
    this.name = this.constructor.name;
  }
}

class InvalidInputError extends Error {
  constructor(input) {
    super(`Invalid input '${input}'`);
    this.input = input;
    this.name = this.constructor.name;
  }
}

class InvalidArgumentError extends Error {
  constructor(arg, config) {
    super(`Incorrect command '${arg}': supported commands list: ${config}`);
    this.arg = arg;
    this.name = this.constructor.name;
  }
}

const errors = {
  OperationFailedError,
  InvalidInputError,
  InvalidArgumentError,
};

const isCustomError = (errorName) => {
  return Object.keys(errors).find((name) => name === errorName);
}

export {
  OperationFailedError,
  InvalidInputError,
  InvalidArgumentError,
  isCustomError,
};
