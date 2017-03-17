'use strict';

describe('Service: academicaService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var academicaService;
  beforeEach(inject(function (_academicaService_) {
    academicaService = _academicaService_;
  }));

  it('should do something', function () {
    expect(!!academicaService).toBe(true);
  });

});
