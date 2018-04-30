'use strict';

describe('Controller: MateriasPosgradoFormalizarSolicitudCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasPosgradoFormalizarSolicitudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasPosgradoFormalizarSolicitudCtrl = $controller('MateriasPosgradoFormalizarSolicitudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasPosgradoFormalizarSolicitudCtrl.awesomeThings.length).toBe(3);
  });
});
