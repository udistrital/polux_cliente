'use strict';

describe('Controller: RegistrarTgCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var RegistrarTgCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegistrarTgCtrl = $controller('RegistrarTgCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RegistrarTgCtrl.awesomeThings.length).toBe(3);
  });
});
