'use strict';

describe('Service: coreAmazonCrudService', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var coreAmazonCrudService;
  beforeEach(inject(function (_coreAmazonCrudService_) {
    coreAmazonCrudService = _coreAmazonCrudService_;
  }));

  it('should do something', function () {
    expect(!!coreAmazonCrudService).toBe(true);
  });

});
