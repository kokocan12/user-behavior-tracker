import { onClick } from './click';
import { onKeyUp } from './keyboard';
import { bindLogHandler, TLog } from './scheduler';
import { checkFocusChange, onVisibilityChange } from './visibility';

function track(element: HTMLElement, callback?: (log: TLog) => void) {
  if (element) {
    element.addEventListener('keyup', onKeyUp);
    element.addEventListener('click', onClick);
    window.addEventListener('popstate', onClick);
    document.addEventListener('visibilitychange', onVisibilityChange);
    checkFocusChange();

    bindLogHandler(callback);
  }
}

export { track };
