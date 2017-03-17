'use strict';

describe('Controller: ConsultaPropuestaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var ConsultaPropuestaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsultaPropuestaCtrl = $controller('ConsultaPropuestaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConsultaPropuestaCtrl.awesomeThings.length).toBe(3);
  });
});
