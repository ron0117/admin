import assert from 'node:assert/strict';
import test from 'node:test';
import { pointPricesPayload } from '../src/utils/point-pricing';

test('Live edits send all four server specs without mixing local and API prices', () => {
  const keys = ['local', 'high', 'medium', 'good'];
  assert.deepEqual(
    pointPricesPayload(
      keys.map(specKey => ({ specKey, unitPoints: 0 })),
      {
        unitLocal: 1,
        unitHigh: 100,
        unitMedium: 100,
        unitGood: 100
      }
    ),
    keys.map(specKey => ({
      specKey,
      unitPoints: specKey === 'local' ? 1 : 100
    }))
  );
});
test('old servers do not receive an unsupported local spec; unknown specs survive edits', () => {
  assert.deepEqual(
    pointPricesPayload(
      [
        { specKey: 'high', unitPoints: 15 },
        { specKey: 'future', unitPoints: 7 }
      ],
      {
        unitHigh: 100,
        unitLocal: 1
      }
    ),
    [
      { specKey: 'high', unitPoints: 100 },
      { specKey: 'future', unitPoints: 7 }
    ]
  );
});
test('image and copy prices are accepted, but missing, negative and fractional prices are rejected', () => {
  for (const unitPoints of [10, 3, 0]) {
    assert.deepEqual(
      pointPricesPayload([{ specKey: 'default', unitPoints: 0 }], {
        unitPoints
      }),
      [{ specKey: 'default', unitPoints }]
    );
  }
  for (const unitLocal of [undefined, -1, 1.5, Number.NaN]) {
    assert.throws(() => pointPricesPayload([{ specKey: 'local', unitPoints: 1 }], { unitLocal }));
  }
});
