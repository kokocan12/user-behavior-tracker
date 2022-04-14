/// <reference types="cypress" />
import { syncEvents, SyncEvent, pushEvent, pop } from '../../src/scheduler';

context('스케쥴러 테스트', () => {
  beforeEach(() => {
    // heap 초기화
    while (syncEvents.length) {
      syncEvents.pop();
    }
  });

  it('push 함수 정확도 테스트', () => {
    const events = [
      { evt: new Event('click'), timestamp: 1000, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1500, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1200, type: SyncEvent },
      { evt: new Event('click'), timestamp: 800, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1300, type: SyncEvent },
    ];

    events.forEach((event) => {
      pushEvent(event);
    });

    /** expect
     *  800
        1000      1200
        1500 1300
     */

    const orderedEvents = syncEvents.map((event) => event.timestamp);

    expect(orderedEvents).deep.equal([800, 1000, 1200, 1500, 1300]);
  });

  it('pop 함수 정확도 테스트', () => {
    const events = [
      { evt: new Event('click'), timestamp: 1000, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1500, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1200, type: SyncEvent },
      { evt: new Event('click'), timestamp: 800, type: SyncEvent },
      { evt: new Event('click'), timestamp: 750, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1350, type: SyncEvent },
      { evt: new Event('click'), timestamp: 12000, type: SyncEvent },
      { evt: new Event('click'), timestamp: 10000, type: SyncEvent },
      { evt: new Event('click'), timestamp: 1300, type: SyncEvent },
    ];

    events.forEach((event) => {
      pushEvent(event);
    });

    const orderedEvents = [];

    while (true) {
      const syncEvent = pop(syncEvents);

      if (syncEvent) orderedEvents.push(syncEvent.timestamp);
      else break;
    }

    expect(orderedEvents).deep.equal([750, 800, 1000, 1200, 1300, 1350, 1500, 10000, 12000]);
  });
});
