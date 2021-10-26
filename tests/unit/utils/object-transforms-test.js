import { without, compact } from '../../../utils/object-transforms';
import { module, test } from 'qunit';

module('Unit | Utility | object transforms', function () {
  test('#without returns an object without the specified keys', function (assert) {
    const employee = {
      name: 'Milton Waddams',
      stapler: 'Red',
      deskLocation: 'basement',
    };

    const expectedResult = {
      name: 'Milton Waddams',
      deskLocation: 'basement',
    };

    const result = without(employee, ['stapler']);

    assert.deepEqual(
      result,
      expectedResult,
      'it returns an object without the specified keys'
    );
  });

  test('#compact returns an object with all `null` and `undefined` elements removed', function (assert) {
    const rawData = {
      firstName: 'Michael',
      lastName: 'Bolton',
      company: undefined,
      age: null,
      favoriteDrink: '',
    };
    const expectedResult = {
      firstName: 'Michael',
      lastName: 'Bolton',
    };

    const result = compact(rawData);
    assert.deepEqual(
      result,
      expectedResult,
      'it should not contain `null` or `undefined` elements'
    );
  });
});
