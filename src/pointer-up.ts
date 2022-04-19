/**
 *  this file handle pointer up events,
 *  Using dragged text, find the text you are interested in.
 */

import { timestampToTimestring } from './format';
import { AsyncEvent, getCurrentTime, pushEvent, TEvent, TLog } from './scheduler';

export const POINTER_UP_EVENT = 'pointer-up';
const TEXT_SELECT = 'text-select';

export function onPointerUp(evt: PointerEvent) {
  pushEvent({
    evt,
    eventType: POINTER_UP_EVENT,
    syncType: AsyncEvent,
    timestamp: getCurrentTime(),
  });
}

export function handlePointerUpEvent({ timestamp }: TEvent, callback: (log: TLog) => void) {
  const selectionText = document.getSelection().toString();
  if (selectionText) {
    callback({
      contents: selectionText,
      time: timestampToTimestring(timestamp),
      timestamp,
      type: TEXT_SELECT,
    });
  }
}
