'use strict';

describe('Controller: MateriasProfundizacionSeleccionAdmitidosCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasProfundizacionSeleccionAdmitidosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionSeleccionAdmitidosCtrl = $controller('MateriasProfundizacionSeleccionAdmitidosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionSeleccionAdmitidosCtrl.awesomeThings.length).toBe(3);
  });
});
