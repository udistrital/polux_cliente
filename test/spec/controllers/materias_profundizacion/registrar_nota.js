'use strict';

describe('Controller: MateriasProfundizacionRegistrarNotaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasProfundizacionRegistrarNotaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionRegistrarNotaCtrl = $controller('MateriasProfundizacionRegistrarNotaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionRegistrarNotaCtrl.awesomeThings.length).toBe(3);
  });
});
