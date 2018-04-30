'use strict';

describe('Controller: NoPermissionCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var NoPermissionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NoPermissionCtrl = $controller('NoPermissionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NoPermissionCtrl.awesomeThings.length).toBe(3);
  });
});
