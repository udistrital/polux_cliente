'use strict';

describe('Controller: TrabajoGradoRevisarAnteproyectoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var TrabajoGradoRevisarAnteproyectoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrabajoGradoRevisarAnteproyectoCtrl = $controller('TrabajoGradoRevisarAnteproyectoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TrabajoGradoRevisarAnteproyectoCtrl.awesomeThings.length).toBe(3);
  });
});
