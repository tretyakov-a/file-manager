
class OperationFailed extends Error {
  constructor(operation) {
    super(`Operation failed ${operation}`);
    this.operation = operation;
    this.name = this.constructor.name;
  }
}

class InvalidInput extends Error {
  constructor(input) {
    super(`Invalid input '${input}'`);
    this.input = input;
    this.name = this.constructor.name;
  }
}

class InvalidArgument extends Error {
  constructor(arg, config) {
    super(`Incorrect command '${arg}': supported commands list: ${config}`);
    this.arg = arg;
    this.name = this.constructor.name;
  }
}

export {
  OperationFailed,
  InvalidInput,
  InvalidArgument,
};
