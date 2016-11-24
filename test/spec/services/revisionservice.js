'use strict';

describe('Service: revisionService', function () {

  // load the service's module
  beforeEach(module('poluxApp'));

  // instantiate service
  var revisionService;
  beforeEach(inject(function (_revisionService_) {
    revisionService = _revisionService_;
  }));

  it('should do something', function () {
    expect(!!revisionService).toBe(true);
  });

});
