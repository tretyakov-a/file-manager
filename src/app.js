import readline from 'readline';
import os from 'os';
import EventEmmiter from 'events';
import parseArguments from './arguments-parse.js';

const LINE_START = '> ';
const MESSAGES = {
  WELCOME: (username) => `Welcome to the File Manager, ${username}!\n`,
  FAREWELL: (username = 'unknown') => `\nThank you for using File Manager, ${username}!\n`,
  DIRECTORY: (dir) => `You are currently in ${dir}\n${LINE_START}`,
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

  _initEvents() {
    this.on(App.EVENTS.START, this.onStart);
    this.on(App.EVENTS.CLOSE, this.onClose);
    this.on(App.EVENTS.COMMAND, this.onCommand);
    this.on(App.EVENTS.ERROR, this.onError);
  }

  onStart = () => {
    process.stdout.write(MESSAGES.WELCOME(this.userName));
    process.stdout.write(MESSAGES.DIRECTORY(this.workingDirectory));
  }

  onClose = () => {
    process.stdout.write(MESSAGES.FAREWELL(this.userName));
    this.readline.close();
    process.exitCode = 0;
  }

  onCommand = () => {
    process.stdout.write(`Command was typed: ${command}\n${LINE_START}`);
  }

  onError = (err) => {
    console.error(err.message);
    this.emit(App.EVENTS.CLOSE);
  }

  _initReadline() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    this.readline.on('line', (line) => {
      if (line.trim() === 'exit') {
        return this.emit(App.EVENTS.CLOSE);
      }
      this.emit(App.EVENTS.COMMAND, line)
    });
    
    this.readline.on('SIGINT', () => this.emit(App.EVENTS.CLOSE));
  }
}

App.EVENTS = {
  START: 'start',
  CLOSE: 'close',
  COMMAND: 'command',
  ERROR: 'error',
}
