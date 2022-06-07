import Command from './command.js';
import App from '../app.js';

export default new Command('.exit', 1, async function() {
  this.app.emit(App.EVENTS.CLOSE);
});
