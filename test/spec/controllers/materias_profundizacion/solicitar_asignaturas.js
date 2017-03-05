'use strict';

describe('Controller: MateriasProfundizacionSolicitarAsignaturasCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var MateriasProfundizacionSolicitarAsignaturasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionSolicitarAsignaturasCtrl = $controller('MateriasProfundizacionSolicitarAsignaturasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionSolicitarAsignaturasCtrl.awesomeThings.length).toBe(3);
  });
});
