import { AsyncEvent, getCurrentTime, pushEvent, TEvent, TLog } from './scheduler';
import { timestampToTimestring } from './format';

let visibilityChangeCount = 0;
let visibilityChangeCountBuffer = 0;
let lastFocusState = true;
export const FOCUS_EVENT = 'focus';
const FOCUS_CHANGE = 'focus-change';
const MOVE_TO_ANOTHER_TAB = 'move-to-another-tab';
const MOVE_TO_CURRENT_TAB = 'move-to-current-tab';
const MOVE_TO_ANOTHER_WINDOW = 'move-to-another-window';
const MOVE_TO_CURRENT_WINDOW = 'move-to-current-window';

export function onVisibilityChange() {
  visibilityChangeCountBuffer += 1;
}

export function checkFocusChange() {
  pushEvent({
    evt: new Event('focus'),
    eventType: FOCUS_EVENT,
    syncType: AsyncEvent,
    timestamp: getCurrentTime(),
  });
}

export function handleFocusEvent({ timestamp }: TEvent, callback: (log: TLog) => void) {
  const currentFocusState = document.hasFocus();

  if (lastFocusState !== currentFocusState) {
    if (currentFocusState) {
      callback({
        contents:
          visibilityChangeCount !== visibilityChangeCountBuffer
            ? MOVE_TO_CURRENT_TAB
            : MOVE_TO_CURRENT_WINDOW,
        timestamp,
        type: FOCUS_CHANGE,

        time: timestampToTimestring(timestamp),
      });
    } else {
      callback({
        contents:
          visibilityChangeCount !== visibilityChangeCountBuffer
            ? MOVE_TO_ANOTHER_TAB
            : MOVE_TO_ANOTHER_WINDOW,
        timestamp,
        type: FOCUS_CHANGE,

        time: timestampToTimestring(timestamp),
      });
    }
  }
  visibilityChangeCount = visibilityChangeCountBuffer;
  lastFocusState = currentFocusState;
  setTimeout(() => {
    checkFocusChange();
  }, 150);
}
