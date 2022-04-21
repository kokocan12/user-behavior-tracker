/**
 *  This file handles pointer move events.
 *  Get information about the photo you are interested in by using the pointer move.
 */

import { timestampToTimestring } from './format';
import { AsyncEvent, getCurrentTime, pushEvent, TEvent, TLog } from './scheduler';

const IMG_TAG = 'IMG';
export const POINTER_MOVE_EVENT = 'pointer-move';
const IMAGE_VIEWING = 'image-viewing';
let lastPointedImage = '';
let lastPointedTime = getCurrentTime();
const TIME_INTERVAL = 2000;
const imgViewingCache: { [attr: string]: boolean } = {};

export function onPointerMove(evt: PointerEvent) {
  pushEvent({
    eventType: POINTER_MOVE_EVENT,
    evt,
    syncType: AsyncEvent,
    timestamp: getCurrentTime(),
  });
}

export function handlePointerMoveEvent({ evt, timestamp }: TEvent, callback: (log: TLog) => void) {
  const target = evt.target as HTMLElement;

  if (target.tagName === IMG_TAG) {
    const imgSrc = target.getAttribute('src');

    if (lastPointedImage !== imgSrc) {
      lastPointedImage = imgSrc;
      lastPointedTime = getCurrentTime();
    } else {
      // eslint-disable-next-line no-prototype-builtins
      const alreadyStored = Object(imgViewingCache).hasOwnProperty(imgSrc);
      if (getCurrentTime() - lastPointedTime > TIME_INTERVAL && !alreadyStored) {
        imgViewingCache[imgSrc] = true;
        callback({
          contents: imgSrc,
          time: timestampToTimestring(timestamp),
          timestamp,
          type: IMAGE_VIEWING,
        });
      }
    }
  }
}
