'use strict';

describe('Controller: FormatoFormatoSesionProyectoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var FormatoFormatoSesionProyectoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoFormatoSesionProyectoCtrl = $controller('FormatoFormatoSesionProyectoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoFormatoSesionProyectoCtrl.awesomeThings.length).toBe(3);
  });
});
