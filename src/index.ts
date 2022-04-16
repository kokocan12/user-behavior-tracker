import { onClick } from './click';
import { onKeyUp } from './keyboard';
import { bindLogHandler, TLog } from './scheduler';

function track(element: HTMLElement, callback?: (log: TLog) => void) {
  if (element) {
    window.addEventListener('keyup', onKeyUp);
    element.addEventListener('click', onClick);
    window.addEventListener('popstate', onClick);

    bindLogHandler(callback);
  }
}

export { track };
