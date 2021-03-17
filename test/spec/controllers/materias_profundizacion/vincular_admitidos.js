'use strict';

describe('Controller: MateriasProfundizacionVincularAdmitidosCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasProfundizacionVincularAdmitidosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionVincularAdmitidosCtrl = $controller('MateriasProfundizacionVincularAdmitidosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionVincularAdmitidosCtrl.awesomeThings.length).toBe(3);
  });
});
