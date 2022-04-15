/// <reference types="cypress" />
import {
  syncEvents,
  asyncEvents,
  logs,
  SyncEvent,
  AsyncEvent,
  pushEvent,
  pop,
  bindLogHandler,
} from '../../src/scheduler';

context('Scheduler', () => {
  beforeEach(() => {
    // heap 초기화
    while (syncEvents.length) {
      syncEvents.pop();
    }
    while (asyncEvents.length) {
      asyncEvents.pop();
    }
    while (logs.length) {
      logs.pop();
    }
  });

  it('push 함수 정확도 테스트', () => {
    const events = [
      { evt: new Event('click'), timestamp: 1000, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1500, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1200, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 800, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1300, type: AsyncEvent },
    ];

    events.forEach((event) => {
      pushEvent(event);
    });

    /** expect
     *  800
        1000      1200
        1500 1300
     */

    const orderedEvents = asyncEvents.map((event) => event.timestamp);

    expect(orderedEvents).deep.equal([800, 1000, 1200, 1500, 1300]);
  });

  it('pop 함수 정확도 테스트', () => {
    const events = [
      { evt: new Event('click'), timestamp: 1000, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1500, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1200, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 800, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 750, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1350, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 12000, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 10000, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 1300, type: AsyncEvent },
    ];

    events.forEach((event) => {
      pushEvent(event);
    });

    const orderedEvents = [];

    while (true) {
      const asyncEvent = pop(asyncEvents);

      if (asyncEvent) orderedEvents.push(asyncEvent.timestamp);
      else break;
    }

    expect(orderedEvents).deep.equal([750, 800, 1000, 1200, 1300, 1350, 1500, 10000, 12000]);
  });

  it('work loop handler 정확도 테스트', async () => {
    const events = [
      { evt: new Event('click'), timestamp: 100, type: SyncEvent },
      { evt: new Event('click'), timestamp: 200, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 300, type: SyncEvent },
      { evt: new Event('click'), timestamp: 400, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 500, type: SyncEvent },
      { evt: new Event('click'), timestamp: 650, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 550, type: SyncEvent },
      { evt: new Event('click'), timestamp: 750, type: AsyncEvent },
      { evt: new Event('click'), timestamp: 700, type: AsyncEvent },
    ];

    const result = [];
    bindLogHandler(({ contents, timestamp }) => {
      result.push({ contents, timestamp });
    });

    events.forEach((event) => {
      pushEvent(event);
    });

    await cy.wait(150);

    expect(result).deep.equal([
      { contents: 'sync', timestamp: 100 },
      { contents: 'async', timestamp: 200 },
      { contents: 'sync', timestamp: 300 },
      { contents: 'async', timestamp: 400 },
      { contents: 'sync', timestamp: 500 },
      { contents: 'sync', timestamp: 550 },
      { contents: 'async', timestamp: 650 },
      { contents: 'async', timestamp: 700 },
      { contents: 'async', timestamp: 750 },
    ]);
  });
});
