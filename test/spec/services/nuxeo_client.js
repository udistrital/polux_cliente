'use strict';

describe('Service: nuxeoClient', function () {

  // load the service's module
  beforeEach(module('poluxClienteApp'));

  // instantiate service
  var nuxeoClient;
  beforeEach(inject(function (_nuxeoClient_) {
    nuxeoClient = _nuxeoClient_;
  }));

  it('should do something', function () {
    expect(!!nuxeoClient).toBe(true);
  });

});
