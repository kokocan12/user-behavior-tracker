export interface TEvent {
  evt: Event;
  timestamp: number;
  type: number;
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

export const SyncEvent = 0b01;
export const AsyncEvent = 0b10;

export const asyncEvents: EventHeap = [];
export const syncEvents: EventHeap = [];
export const logs: LogHeap = [];

// True when the workLoop is running
let workTF = false;

const yieldInterval = 20;
let deadline = 0;

const messageChannel = new MessageChannel();
const port = messageChannel.port2;

function getCurrentTime() {
  return new Date().valueOf();
}

function shouldYield() {
  return deadline - getCurrentTime();
}

function workLoop(deadline_?: IdleDeadline) {
  workTF = true;
  if (!deadline_) {
    deadline_ = { timeRemaining: shouldYield, didTimeout: false };
  }

  while (deadline_.timeRemaining()) {
    let work = null;
    // check out the sync events first
    if (peek(syncEvents)) {
      work = pop(syncEvents);
      handleEvent(work);
    }
    // and check async events
    else if (peek(asyncEvents)) {
      work = pop(asyncEvents);
      handleEvent(work);
    }
    // finally check the logs
    else if (peek(logs)) {
      work = pop(logs);
      handleLog(work);
    }

    if (work === null) break;
  }

  // check remain tasks
  if (peek(syncEvents) || peek(asyncEvents) || peek(logs)) {
    port.postMessage(null);
  } else {
    // END
    workTF = false;
  }
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

messageChannel.port1.addEventListener('message', workUntilDeadline);

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
  const contents = event.type === SyncEvent ? 'sync' : 'async';

  pushLog({ type: '', contents, time: '', timestamp: event.timestamp });
}

export function pushEvent({ evt, timestamp, type }: TEvent) {
  if (type === AsyncEvent) {
    asyncEvents.push({ evt, timestamp, type });
    shiftUp(asyncEvents);
    if (!workTF) port.postMessage(null);
  } else if (type === SyncEvent) {
    syncEvents.push({ evt, timestamp, type });
    shiftUp(syncEvents);
    if (!workTF) port.postMessage(null);
  }
}

function handleLog(log: TLog) {
  //
}

function pushLog({ contents, time, timestamp, type }: TLog) {}

function peek(heap: Heap) {
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
