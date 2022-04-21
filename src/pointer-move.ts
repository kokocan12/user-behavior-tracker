/**
 *  This file handles pointer move events.
 *  Get information about the photo you are interested in by using the pointer move.
 */

import { timestampToTimestring } from './format';
import { AsyncEvent, getCurrentTime, pushEvent, TEvent, TLog } from './scheduler';

const IMG_TAG = 'IMG';
export const POINTER_MOVE_EVENT = 'pointer-move';
const IMAGE_VIEWING = 'image-viewing';

let pointerThrottleTimeRef = getCurrentTime();
let lastPointedImage = '';
let lastPointedTime = getCurrentTime();
const TIME_INTERVAL = 1000;
const THROTTLE_INTERVAL = 10;
const imgViewingCache: { [attr: string]: boolean } = {};

export function onPointerMove(evt: PointerEvent) {
  if (getCurrentTime() - pointerThrottleTimeRef > THROTTLE_INTERVAL) {
    pushEvent({
      eventType: POINTER_MOVE_EVENT,
      evt,
      syncType: AsyncEvent,
      timestamp: getCurrentTime(),
    });
    pointerThrottleTimeRef = getCurrentTime();
  }
}

function imgTagFilter(node) {
  if (node.tagName === IMG_TAG) {
    return NodeFilter.FILTER_ACCEPT;
  }
  return NodeFilter.FILTER_SKIP;
}

function hasOneImgTagOrIsImgTag(node: HTMLElement) {
  if (node.tagName === IMG_TAG) return true;

  // BFS
  let imgTagCount = 0;
  const queue = [...node.childNodes];
  while (queue.length) {
    const item = queue.shift() as HTMLElement;

    if (item.tagName === IMG_TAG) {
      imgTagCount += 1;
    } else {
      item.childNodes.forEach((child) => queue.push(child));
    }
  }

  return imgTagCount === 1;
}

export function handlePointerMoveEvent({ evt, timestamp }: TEvent, callback: (log: TLog) => void) {
  const target = evt.target as HTMLElement;

  if (!hasOneImgTagOrIsImgTag(target)) return;

  const imgWalker = document.createTreeWalker(target, NodeFilter.SHOW_ELEMENT, imgTagFilter);

  console.log(imgWalker.currentNode);

  if ((imgWalker.currentNode as HTMLElement).tagName === IMG_TAG || imgWalker.nextNode()) {
    const imgTag = imgWalker.currentNode;
    const imgSrc = (imgTag as HTMLElement).getAttribute('src');

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
