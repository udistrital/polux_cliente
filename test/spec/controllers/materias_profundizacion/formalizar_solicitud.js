'use strict';

describe('Controller: MateriasProfundizacionFormalizarSolicitudCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasProfundizacionFormalizarSolicitudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionFormalizarSolicitudCtrl = $controller('MateriasProfundizacionFormalizarSolicitudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionFormalizarSolicitudCtrl.awesomeThings.length).toBe(3);
  });
});
