import { timestampToTimestring } from './format';
import { getCurrentTime, pushEvent, SyncEvent, TEvent, TLog } from './scheduler';

const INPUT_TAG = 'INPUT';
export const KEYBOARD_EVENT = 'keyboard';

let debounceTimer: any = null;

export function onKeyUp(evt: KeyboardEvent) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const focusedInput = getFocusedInput();
    if (focusedInput) {
      pushEvent({
        evt: { ...evt, target: focusedInput },
        timestamp: getCurrentTime(),
        syncType: SyncEvent,
        eventType: KEYBOARD_EVENT,
      });
    }
  }, 300);
}

function getFocusedInput() {
  if (document.activeElement.tagName === INPUT_TAG) {
    return document.activeElement;
  }

  return null;
}

export function handleKeyboardEvent({ evt, timestamp }: TEvent): TLog {
  const contents = (evt.target as HTMLInputElement).value;
  return { contents, timestamp, type: KEYBOARD_EVENT, time: timestampToTimestring(timestamp) };
}
