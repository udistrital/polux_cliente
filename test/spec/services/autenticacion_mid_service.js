'use strict';

describe('Service: autenticacionMidService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var autenticacionMidService;
  beforeEach(inject(function (_autenticacionMidService_) {
    autenticacionMidService = _autenticacionMidService_;
  }));

  it('should do something', function () {
    expect(!!autenticacionMidService).toBe(true);
  });

});
