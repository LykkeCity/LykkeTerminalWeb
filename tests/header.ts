import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

const header = ReactSelector('Header');
const instrumentPicker = ReactSelector('InstrumentPicker');
const instrumentPerformanceFigure = ReactSelector('InstrumentPerformanceFigure');
const instrumentPopover = ReactSelector('InstrumentPopover');

fixture `Header test`
  .page `http://localhost:3001/`;

test('Header should exist', async t => {
  await t
    .expect(header.exists).ok()
});

test('InstrumentPicker should exist', async t => {
  await t
    .expect(instrumentPicker.exists).ok();
});

test('InstrumentPerformanceFigure should exist', async t => {
  await t
    .expect(instrumentPerformanceFigure.exists).ok;
  await t
    .expect(instrumentPerformanceFigure.count).eql(5)
});

test('InstrumentPopover should appear', async t => {
  await t
    .click(instrumentPicker)
    .expect(instrumentPopover.exists).ok();
});


