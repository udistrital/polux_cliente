'use strict';

describe('Controller: EvaluarProyectoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var EvaluarProyectoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EvaluarProyectoCtrl = $controller('EvaluarProyectoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EvaluarProyectoCtrl.awesomeThings.length).toBe(3);
  });
});
