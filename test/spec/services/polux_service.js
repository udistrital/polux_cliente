'use strict';

describe('Service: poluxService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var poluxService;
  beforeEach(inject(function (_poluxService_) {
    poluxService = _poluxService_;
  }));

  it('should do something', function () {
    expect(!!poluxService).toBe(true);
  });

});
