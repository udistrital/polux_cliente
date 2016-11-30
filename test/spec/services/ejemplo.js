'use strict';

describe('Service: ejemplo', function () {

  // load the service's module
  beforeEach(module('poluxApp'));

  // instantiate service
  var ejemplo;
  beforeEach(inject(function (_ejemplo_) {
    ejemplo = _ejemplo_;
  }));

  it('should do something', function () {
    expect(!!ejemplo).toBe(true);
  });

});
