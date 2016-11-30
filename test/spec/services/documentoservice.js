'use strict';

describe('Service: documentoService', function () {

  // load the service's module
  beforeEach(module('poluxApp'));

  // instantiate service
  var documentoService;
  beforeEach(inject(function (_documentoService_) {
    documentoService = _documentoService_;
  }));

  it('should do something', function () {
    expect(!!documentoService).toBe(true);
  });

});
