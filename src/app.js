import readline from 'readline';
import os from 'os';
import EventEmmiter from 'events';
import parseArguments from './arguments-parse.js';

const LINE_START = '> ';
const MESSAGES = {
  WELCOME: (username) => `Welcome to the File Manager, ${username}!\n`,
  FAREWELL: (username) => `\nThank you for using File Manager, ${username}!\n`,
  DIRECTORY: (dir) => `You are currently in ${dir}\n${LINE_START}`,
};

export default class App extends EventEmmiter {
  constructor(args) {
    super();
    const { userName } = parseArguments(args, {
      userName: '--username'
    });
    const userInfo = os.userInfo();
    this.workingDirectory = userInfo.homedir;
    this.userName = userName || userInfo.username;

    this._initReadline();
    this._initEvents();
    this.emit('start');
  }

  _initEvents() {
    this.on('start', () => {
      process.stdout.write(MESSAGES.WELCOME(this.userName));
      process.stdout.write(MESSAGES.DIRECTORY(this.workingDirectory));
    });

    this.on('close', () => {
      process.stdout.write(MESSAGES.FAREWELL(this.userName));
    });

    this.on('command', (command) => {
      process.stdout.write(`Command was typed: ${command}\n${LINE_START}`);
    })
  }

  _initReadline() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    this.readline.on('line', (line) => {
      if (line.trim() === 'exit') {
        return this.readline.close();
      }
      this.emit('command', line)
    });
    
    this.readline.on('SIGINT', () => this.readline.close());
    
    this.readline.on('close', () => {
      this.emit('close');
      process.exitCode = 0;
    });
  }
}
