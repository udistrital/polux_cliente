'use strict';

describe('Controller: MateriasProfundizacionListarSolicitudesCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var MateriasProfundizacionListarSolicitudesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasProfundizacionListarSolicitudesCtrl = $controller('MateriasProfundizacionListarSolicitudesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasProfundizacionListarSolicitudesCtrl.awesomeThings.length).toBe(3);
  });
});
