'use strict';

describe('Service: coreService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var coreService;
  beforeEach(inject(function (_coreService_) {
    coreService = _coreService_;
  }));

  it('should do something', function () {
    expect(!!coreService).toBe(true);
  });

});
