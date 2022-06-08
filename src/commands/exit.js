import Command from './command.js';
import App from '../app.js';

async function exit() {
  this.app.emit(App.EVENTS.CLOSE);
  return this.onSuccess('Exiting...');
}

export default Command.createOptions(
  '.exit',
  [],
  'Exit programm',
  exit
);