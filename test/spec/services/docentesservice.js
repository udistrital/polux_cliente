'use strict';

describe('Service: docentesService', function () {

  // load the service's module
  beforeEach(module('poluxApp'));

  // instantiate service
  var docentesService;
  beforeEach(inject(function (_docentesService_) {
    docentesService = _docentesService_;
  }));

  it('should do something', function () {
    expect(!!docentesService).toBe(true);
  });

});
