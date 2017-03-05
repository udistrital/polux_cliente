'use strict';

describe('Service: poluxMidService', function () {

  // load the service's module
  beforeEach(module('poluxApp'));

  // instantiate service
  var poluxMidService;
  beforeEach(inject(function (_poluxMidService_) {
    poluxMidService = _poluxMidService_;
  }));

  it('should do something', function () {
    expect(!!poluxMidService).toBe(true);
  });

});
