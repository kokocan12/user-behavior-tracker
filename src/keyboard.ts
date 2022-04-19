import { timestampToTimestring } from './format';
import { AsyncEvent, getCurrentTime, pushEvent, TEvent, TLog } from './scheduler';

const INPUT_TAG = 'INPUT';
const ENTER = 'Enter';
export const KEYBOARD_EVENT = 'keyboard';

let debounceTimer: any = null;

export function onKeyUp(evt: KeyboardEvent) {
  clearTimeout(debounceTimer);

  const callback = () => {
    const focusedInput = getFocusedInput();
    if (focusedInput) {
      pushEvent({
        evt: { ...evt, target: focusedInput },
        timestamp: getCurrentTime(),
        syncType: AsyncEvent,
        eventType: KEYBOARD_EVENT,
      });
    }
  };

  if (evt.key === ENTER) {
    callback();
  } else {
    debounceTimer = setTimeout(callback, 300);
  }
}

function getFocusedInput() {
  if (document.activeElement.tagName === INPUT_TAG) {
    return document.activeElement;
  }

  return null;
}

export function handleKeyboardEvent({ evt, timestamp }: TEvent, callback: (log: TLog) => void) {
  const contents = (evt.target as HTMLInputElement).value;

  if (contents) {
    callback({ contents, timestamp, type: KEYBOARD_EVENT, time: timestampToTimestring(timestamp) });
  }
}
