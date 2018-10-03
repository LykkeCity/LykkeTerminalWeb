import {ReactSelector} from 'testcafe-react-selectors';

const priceChart = ReactSelector('Chart');
const depthChart = ReactSelector('DepthChart');
const priceChartTabBtn = ReactSelector('TileTab').withText('Price chart');
const depthChartTabBtn = ReactSelector('TileTab').withText('Depth chart');

fixture `Charts test`
  .page `http://localhost:3001/`;

test('Price chart should exist', async t => {
  await t
    .expect(priceChart.exists).ok();
});

test('Price chart tab button should exist', async t => {
  await t
    .expect(priceChartTabBtn).ok();
});

test('Depth chart tab button should exist', async t => {
  await t
    .expect(depthChartTabBtn).ok();
});

test('Depth chart should appears', async t => {
  await t
    .click(depthChartTabBtn)
    .expect(depthChart.exists).ok();
});