'use strict';

describe('Service: cadenaService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var cadenaService;
  beforeEach(inject(function (_cadenaService_) {
    cadenaService = _cadenaService_;
  }));

  it('should do something', function () {
    expect(!!cadenaService).toBe(true);
  });

});
