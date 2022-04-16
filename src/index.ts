import { onKeyUp } from './keyboard';
import { bindLogHandler, TLog } from './scheduler';

function track(element: HTMLElement, callback?: (log: TLog) => void) {
  if (element) {
    window.addEventListener('keyup', onKeyUp);
    bindLogHandler(callback);
  }
}

export { track };
