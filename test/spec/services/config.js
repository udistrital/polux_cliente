'use strict';

describe('Service: config.js', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var config.js;
  beforeEach(inject(function (_config.js_) {
    config.js = _config.js_;
  }));

  it('should do something', function () {
    expect(!!config.js).toBe(true);
  });

});
