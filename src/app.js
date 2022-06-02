import path from 'path';
import readline from 'readline';
import os from 'os';
import EventEmmiter from 'events';
import { InvalidInputError, InvalidArgumentError, isCustomError } from './errors.js';
import parseArguments from './arguments-parse.js';
import { colorize, colors } from './appearance.js';
import { cat, add, rename, copy, move, remove } from './commands/fs/index.js';
import { list, cd } from './commands/nwd/index.js';

const msg = {
  greet: colorize(colors.yellow),
  error: colorize(colors.redBright),
  service: colorize(colors.greenBright),
  dir: colorize(colors.blueBright),
  file: colorize(colors.white),
}

const LINE_START = '> ';
const MESSAGES = {
  WELCOME: (username) => msg.greet(`*** Welcome to the File Manager, ${username}! ***\n`),
  FAREWELL: (username = 'unknown') => msg.greet(`\nThank you for using File Manager, ${username}!\n`),
  DIRECTORY: (dir) => `You are currently in ${dir}`,
};

export default class App extends EventEmmiter {
  constructor(args) {
    super();
    this._initEvents();
    this._initReadline();

    let argValues = null;
    let userInfo = null;
    try {
      argValues = parseArguments(args, {
        userName: '--username'
      });
      userInfo = os.userInfo();
      this.userName = argValues.userName || userInfo.username;
      this.workingDirectory = path.resolve(userInfo.homedir, 'tmp');
  
      this.emit(App.EVENTS.START);
    } catch (err) {
      this.emit(App.EVENTS.ERROR, err);
    }
  }

  _writePromt = (message) => {
    const dirMessage = MESSAGES.DIRECTORY(this.workingDirectory);
    const outputMessage = !message ? '' : `${message}\n`;
    process.stdout.write(`${outputMessage}${msg.greet(dirMessage)}\n${msg.greet(LINE_START)}`);
  }

  _initEvents() {
    this.on(App.EVENTS.START, this.onStart);
    this.on(App.EVENTS.CLOSE, this.onClose);
    this.on(App.EVENTS.COMMAND, this.onCommand);
    this.on(App.EVENTS.ERROR, this.onError);
  }

  onStart = () => {
    process.stdout.write(MESSAGES.WELCOME(this.userName));
    this._writePromt();
  }

  onClose = () => {
    process.stdout.write(MESSAGES.FAREWELL(this.userName));
    this.readline.close();
    process.exitCode = 1;
  }

  onCommand = async (line) => {
    const [ command, ...args ] = line.split(' ').map((v) => v.trim());
    try {
      const message = (await this._processCommand(command, args)) || '';
      this._writePromt(message);
    } catch (err) {
      this.emit(App.EVENTS.ERROR, err);
    }
  }

  onError = (err) => {
    const isErrorCustom = isCustomError(err.name);
    if (isErrorCustom) {
      this._writePromt(msg.error(err.message));
    } else {
      console.error(err);
    }
    if (!isErrorCustom || err instanceof InvalidArgumentError) {
      this.emit(App.EVENTS.CLOSE);
    }
  }
  
  _initReadline() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.readline.on('line', (line) => this.emit(App.EVENTS.COMMAND, line.trim()));
    this.readline.on('SIGINT', () => this.emit(App.EVENTS.CLOSE));
  }

  async _processCommand(command, args) {
    switch(command) {
      case 'exit': return this.emit(App.EVENTS.CLOSE);
      case 'up': return this.handleUp();
      case 'cd': return await this.handleCd(args);
      case 'ls': return await this.handleLs();
      case 'cat': return await this.handleCat(args);
      case 'add': return await this.handleAdd(args);
      case 'rn': return await this.handleRn(args);
      case 'cp': return await this.handleCp(args);
      case 'mv': return await this.handleMv(args);
      case 'rm': return await this.handleRm(args);
      default: throw new InvalidInputError(command);
    }
  }

  checkArgs = (args, requiredNumberOfArgs) => {
    if (args.length < requiredNumberOfArgs) {
      throw new InvalidInputError(`number of arguments should be ${requiredNumberOfArgs}`);
    }
    return args;
  };

  handleUp = () => {
    const { dir } = path.parse(this.workingDirectory);
    this.workingDirectory = dir;
    return msg.service(`Working directory changed to ${this.workingDirectory}`);
  };

  handleCd = async (args) => {
    const [ pathToDir ] = this.checkArgs(args, 1);
    const source = path.resolve(this.workingDirectory, pathToDir);
    await cd(source);
    this.workingDirectory = source;
    return msg.service(`Working directory changed to ${this.workingDirectory}`);
  };

  handleLs = async () => {
    const filesList = (await list(this.workingDirectory))
      .map((file) => `  ${file.isFile() ? msg.file(file.name) : msg.dir(file.name)}`);
    const currentDir = msg.dir(`${this.workingDirectory}/`);
    return `${currentDir}\n${filesList.join('\n')}`;
  };

  handleCat = async (args) => {
    const [ pathToFile ] = this.checkArgs(args, 1);
    const source = path.resolve(this.workingDirectory, pathToFile);
    return await cat(source);
  };

  handleAdd = async (args) => {
    const [ pathToFile ] = this.checkArgs(args, 1);
    const source = path.resolve(this.workingDirectory, pathToFile);
    await add(source);
    return msg.service(`File successfully added ${source}`);
  };

  handleRn = async (args) => {
    const [ pathToFile, newFileName ] = this.checkArgs(args, 2);
    const source = path.resolve(this.workingDirectory, pathToFile);
    const destination = path.resolve(this.workingDirectory, newFileName); 
    await rename(source, destination);
    return msg.service(`File ${source} successfully renamed to ${destination}`);
  };

  handleCp = async (args) => {
    const [ pathToFile, pathToNewDir ] = this.checkArgs(args, 2);
    const source = path.resolve(this.workingDirectory, pathToFile);
    const destination = path.resolve(this.workingDirectory, pathToNewDir, pathToFile); 
    await copy(source, destination);
    return msg.service(`File ${source} successfully copied to ${destination}`);
  };

  handleMv = async (args) => {
    const [ pathToFile, pathToNewDir ] = this.checkArgs(args, 2);
    const source = path.resolve(this.workingDirectory, pathToFile);
    const destination = path.resolve(this.workingDirectory, pathToNewDir, pathToFile); 
    await move(source, destination);
    return msg.service(`File ${source} successfully moved to ${destination}`);
  };

  handleRm = async (args) => {
    const [ pathToFile ] = this.checkArgs(args, );
    const source = path.resolve(this.workingDirectory, pathToFile); 
    await remove(source);
    return msg.service(`File ${source} successfully removed`);
  };
}

App.EVENTS = {
  START: 'start',
  CLOSE: 'close',
  COMMAND: 'command',
  ERROR: 'error',
}
