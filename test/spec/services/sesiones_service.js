'use strict';

describe('Service: sesionesService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var sesionesService;
  beforeEach(inject(function (_sesionesService_) {
    sesionesService = _sesionesService_;
  }));

  it('should do something', function () {
    expect(!!sesionesService).toBe(true);
  });

});
