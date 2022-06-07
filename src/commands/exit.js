import Command from './command.js';
import App from '../app.js';

export default new Command('.exit', 0, async function() {
  this.app.emit(App.EVENTS.CLOSE);
  return this.onSuccess('Exiting...');
});
