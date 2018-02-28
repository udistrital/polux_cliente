'use strict';

describe('Service: configurationService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var configurationService;
  beforeEach(inject(function (_configurationService_) {
    configurationService = _configurationService_;
  }));

  it('should do something', function () {
    expect(!!configurationService).toBe(true);
  });

});
