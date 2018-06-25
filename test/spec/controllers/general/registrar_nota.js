'use strict';

describe('Controller: GeneralRegistrarNotaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var GeneralRegistrarNotaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GeneralRegistrarNotaCtrl = $controller('GeneralRegistrarNotaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GeneralRegistrarNotaCtrl.awesomeThings.length).toBe(3);
  });
});
