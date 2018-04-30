'use strict';

describe('Controller: MateriasPosgradoListarAprobadosCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasPosgradoListarAprobadosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasPosgradoListarAprobadosCtrl = $controller('MateriasPosgradoListarAprobadosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasPosgradoListarAprobadosCtrl.awesomeThings.length).toBe(3);
  });
});
