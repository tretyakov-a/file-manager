import readline from 'readline';
import os from 'os';
import EventEmmiter from 'events';
import parseArguments from './arguments-parse.js';
import { colorize, yellow, redBright } from './appearance.js';

const greet = colorize(yellow);
const error = colorize(redBright);

const LINE_START = '> ';
const MESSAGES = {
  WELCOME: (username) => greet(`*** Welcome to the File Manager, ${username}! ***\n`),
  FAREWELL: (username = 'unknown') => greet(`\nThank you for using File Manager, ${username}!\n`),
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
      this.workingDirectory = userInfo.homedir;
  
      this.emit(App.EVENTS.START);
    } catch (err) {
      this.emit(App.EVENTS.ERROR, err);
    }
  }

  _writePromt = (message = '') => {
    const dirMessage = MESSAGES.DIRECTORY(this.workingDirectory);
    process.stdout.write(`${message}\n${dirMessage}\n${LINE_START}`);
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
    process.exitCode = 0;
  }

  onCommand = (line) => {
    const [ command, ...args ] = line.split(' ').map((v) => v.trim());
    if (command === 'exit') {
      return this.emit(App.EVENTS.CLOSE);
    }
    
    this._writePromt(`command: ${command}, args:  ${args || '[no-args]'}`);
  }

  onError = (err) => {
    console.error(error(err.message));
    this.emit(App.EVENTS.CLOSE);
  }

  _initReadline() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.readline.on('line', (line) => this.emit(App.EVENTS.COMMAND, line.trim()));
    this.readline.on('SIGINT', () => this.emit(App.EVENTS.CLOSE));
  }

  handleUp = () => {

  };
}

App.EVENTS = {
  START: 'start',
  CLOSE: 'close',
  COMMAND: 'command',
  ERROR: 'error',
}
