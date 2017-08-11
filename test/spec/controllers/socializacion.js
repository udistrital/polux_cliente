'use strict';

describe('Controller: SocializacionCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var SocializacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SocializacionCtrl = $controller('SocializacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SocializacionCtrl.awesomeThings.length).toBe(3);
  });
});
