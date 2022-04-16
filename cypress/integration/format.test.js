import { timestampToTimestring } from '../../src/format';
import moment from 'moment';

context('formatter 테스트', () => {
  it('timestampToTimestring 2자리 시간 테스트', () => {
    const date = moment('2022-04-16 23:23:23');

    expect(timestampToTimestring(date.valueOf())).to.equal('23:23:23');
  });

  it('timestampToTimestring 1자리 시간 테스트', () => {
    const date = moment('2022-04-16 06:05:23');

    expect(timestampToTimestring(date.valueOf())).to.equal('06:05:23');
  });
});
