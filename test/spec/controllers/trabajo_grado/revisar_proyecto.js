'use strict';

describe('Controller: TrabajoGradoRevisarProyectoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var TrabajoGradoRevisarProyectoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrabajoGradoRevisarProyectoCtrl = $controller('TrabajoGradoRevisarProyectoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TrabajoGradoRevisarProyectoCtrl.awesomeThings.length).toBe(3);
  });
});
