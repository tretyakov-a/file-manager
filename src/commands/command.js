import { InvalidInputError, OperationFailedError } from '../errors.js';
import { msg } from '../appearance.js';

export default class Command {
  constructor(name, requiredNumberOfArgs, handler) {
    this.requiredNumberOfArgs = requiredNumberOfArgs;
    this.name = name;
    this.handler = handler;
  }

  run(app, args = []) {
    this.app = app;
    this.args = args;
    this.checkArgs();

    return this.handler.call(this);
  }

  onSuccess(message, data) {
    const outputMessage = message && msg.service(message);
    return { message: outputMessage, data };
  }

  onError(err) {
    throw new OperationFailedError(this.name, err);
  }

  checkArgs() {
    const { args: { length }, requiredNumberOfArgs } = this;
    const isValid = Array.isArray(requiredNumberOfArgs)
      ? requiredNumberOfArgs.includes(length)
      : length === requiredNumberOfArgs
    if (!isValid) {
      throw new InvalidInputError(`number of arguments should be ${this.requiredNumberOfArgs}`);
    }
    return true;
  }
}
