'use strict';

describe('Service: entidadService', function () {

  // load the service's module
  beforeEach(module('poluxApp'));

  // instantiate service
  var entidadService;
  beforeEach(inject(function (_entidadService_) {
    entidadService = _entidadService_;
  }));

  it('should do something', function () {
    expect(!!entidadService).toBe(true);
  });

});
