import { CLICK_EVENT, handleClickEvent } from './click';
import { handleKeyboardEvent, KEYBOARD_EVENT } from './keyboard';

export interface TEvent {
  evt: Event;
  timestamp: number;
  syncType: number;
  eventType: string;
}

export interface TLog {
  timestamp: number;
  time: string;
  type: string;
  contents: string;
}

type EventHeap = TEvent[];
type LogHeap = TLog[];

type HeapItem = TEvent | TLog;
type Heap = EventHeap | LogHeap;

export const SyncEvent = 0b1;
export const AsyncEvent = 0b0;
/**
 *  Events that need to be dealt with immediately are put into syncEvents.
 *  Events that do not need to be dealt with immediately are put into asyncEvents.
 *  Events are moved to logs after processing, and finally logs are handled by logHandler.
 *  logs are always handled asynchronously.
 */
export const syncEvents: EventHeap = [];
export const asyncEvents: EventHeap = [];
export const logs: LogHeap = [];

// the logHandler corresponds to the callback of track function.
let logHandler: (log: TLog) => void = () => {};

// when workMode is SyncMode, syncEvents should be dealt with immediately.
const SyncMode = 0b10;
const AsyncMode = 0b11;
let workMode = AsyncMode;

const yieldInterval = 20;
let deadline = 0;

const messageChannel = new MessageChannel();
const port = messageChannel.port2;

export function getCurrentTime() {
  return new Date().valueOf();
}

function shouldContinue() {
  return deadline - getCurrentTime();
}

function workLoop(deadline_?: IdleDeadline) {
  if (!deadline_) {
    deadline_ = { timeRemaining: shouldContinue, didTimeout: false };
  }

  /**
   *  deadline doesn't matter in SyncMode
   *  when workMode is SyncMode, handle all syncEvents.
   */
  while (workMode === SyncMode || deadline_.timeRemaining()) {
    let work = null;
    // deal with sync events first
    if (peek(syncEvents)) {
      work = pop(syncEvents);
      handleEvent(work);
    }
    // and deal with async events
    else if (workMode === AsyncMode && peek(asyncEvents)) {
      work = pop(asyncEvents);
      handleEvent(work);
    }
    // finally deal with logs
    else if (workMode === AsyncMode && peek(logs)) {
      work = pop(logs);
      handleLog(work);
    }

    if (work === null) break;
  }

  /**
   *  The rest of the tasks are dealt asynchronously.
   */
  if (peek(syncEvents) || peek(asyncEvents) || peek(logs)) {
    port.postMessage(null);
  }
  // END
  workMode = AsyncMode;
}

// for polyfill ( Safari does not support requestIdleCallback API. )
const workUntilDeadline =
  typeof requestIdleCallback === 'function'
    ? () => {
        requestIdleCallback(workLoop);
      }
    : () => {
        deadline = getCurrentTime() + yieldInterval;
        workLoop();
      };

messageChannel.port1.onmessage = workUntilDeadline;

function compare(a: HeapItem, b: HeapItem) {
  const diff = a.timestamp - b.timestamp;
  return diff;
}

function shiftUp(heap: Heap) {
  let idx = heap.length - 1;

  /**
   *   0
   *   1      2
   *   3 4    5 6
   *   78 910 1112 1314
   */
  while (idx > 0) {
    const parentIdx = (idx - 1) >> 1;
    const child = heap[idx];
    const parent = heap[parentIdx];
    if (parent && compare(child, parent) < 0) {
      heap[idx] = parent;
      heap[parentIdx] = child;
      idx = parentIdx;
    } else {
      break;
    }
  }
}

function shiftDown(heap: Heap) {
  let idx = 0;
  const { length } = heap;

  while (idx < length) {
    const leftIdx = idx * 2 + 1;
    const rightIdx = leftIdx + 1;
    const leftItem = heap[leftIdx];
    const rightItem = heap[rightIdx];
    const item = heap[idx];

    if (leftItem && compare(leftItem, item) < 0) {
      if (rightItem && compare(rightItem, leftItem) < 0) {
        heap[idx] = rightItem;
        heap[rightIdx] = item;
        idx = rightIdx;
      } else {
        heap[idx] = leftItem;
        heap[leftIdx] = item;
        idx = leftIdx;
      }
    } else if (rightItem && compare(rightItem, item) < 0) {
      heap[idx] = rightItem;
      heap[rightIdx] = item;
    } else {
      return;
    }
  }
}

function handleEvent(event: TEvent) {
  switch (event.eventType) {
    case KEYBOARD_EVENT:
      handleKeyboardEvent(event, pushLog);
      break;

    case CLICK_EVENT:
      handleClickEvent(event, pushLog);
      break;

    // for test
    default: {
      const contents = event.syncType === SyncEvent ? 'sync' : 'async';
      pushLog({ type: '', contents, time: '', timestamp: event.timestamp });
    }
  }
}

export function pushEvent({ evt, timestamp, syncType, eventType }: TEvent) {
  if (syncType === AsyncEvent) {
    asyncEvents.push({ evt, timestamp, syncType, eventType });
    shiftUp(asyncEvents);

    port.postMessage(null);
  } else if (syncType === SyncEvent) {
    syncEvents.push({ evt, timestamp, syncType, eventType });
    shiftUp(syncEvents);
    workMode = SyncMode;
    workLoop();
  }
}

function handleLog(log: TLog) {
  logHandler(log);
}

function pushLog(log: TLog) {
  logs.push(log);
  shiftUp(logs);
}

export function bindLogHandler($logHandler: (log: TLog) => void) {
  if (typeof $logHandler === 'function') {
    logHandler = $logHandler;
  }
}

export function peek(heap: Heap) {
  if (!heap[0]) {
    return null;
  }

  return heap[0];
}

export function pop(heap: Heap) {
  if (!heap[0]) {
    return null;
  }

  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    shiftDown(heap);
  }

  return first;
}
