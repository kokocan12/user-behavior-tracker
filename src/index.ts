import { onKeyUp } from './keyboard';

function track(element: HTMLElement, callback?: Function) {
  if (element) {
    window.addEventListener('keyup', onKeyUp);
  }
}

export { track };
