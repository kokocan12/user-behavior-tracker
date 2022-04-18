/**
 *  Although the name of this file is click.ts, this file handles page navigation.
 */

import { timestampToTimestring } from './format';
import { AsyncEvent, getCurrentTime, pushEvent, TEvent, TLog } from './scheduler';

export const CLICK_EVENT = 'click';
const PAGE_NAVIGATE = 'page-navigate';
let lastVisitedPath = window.location.pathname;
export function onClick(evt: PointerEvent) {
  pushEvent({ evt, timestamp: getCurrentTime(), eventType: CLICK_EVENT, syncType: AsyncEvent });
}

export function handleClickEvent({ timestamp }: TEvent, callback: (log: TLog) => void) {
  const { pathname } = window.location;

  if (pathname !== lastVisitedPath) {
    lastVisitedPath = pathname;
    callback({
      contents: pathname,
      timestamp,
      time: timestampToTimestring(timestamp),
      type: PAGE_NAVIGATE,
    });
  }
}
