'use strict';

describe('Controller: MateriasProfundizacionPublicarAsignaturasCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasProfundizacionPublicarAsignaturasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionPublicarAsignaturasCtrl = $controller('MateriasProfundizacionPublicarAsignaturasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionPublicarAsignaturasCtrl.awesomeThings.length).toBe(3);
  });
});
