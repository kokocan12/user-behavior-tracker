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

const asyncEvents: EventHeap = [];
const syncEvents: EventHeap = [];
const logs: LogHeap = [];

function compare(a: HeapItem, b: HeapItem) {
  const diff = a.timestamp - b.timestamp;
  return diff;
}

function siftUp(heap: Heap) {}

function siftDown(heap: Heap, item: HeapItem, i: number) {
  let index = i;
  const { length } = heap;
  const halfLength = length >> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    if (compare(left, item) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = item;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = item;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, item) < 0) {
      heap[index] = right;
      heap[rightIndex] = item;
      index = rightIndex;
    } else {
      return;
    }
  }
}

export function pushEvent({ evt, timestamp, type }: TEvent) {
  if (type === AsyncEvent) {
    asyncEvents.push({ evt, timestamp, type });
    siftUp(asyncEvents);
  } else if (type === SyncEvent) {
    syncEvents.push({ evt, timestamp, type });
    siftUp(syncEvents);
  }
}

function pushLog({ contents, time, timestamp, type }: TLog) {}

function peek(heap: Heap) {
  if (!heap[0]) {
    return null;
  }

  return heap[0];
}

function pop(heap: Heap) {
  if (!heap[0]) {
    return null;
  }

  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }

  return first;
}
