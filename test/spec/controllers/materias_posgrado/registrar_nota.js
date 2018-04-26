'use strict';

describe('Controller: MateriasPosgradoRegistrarNotaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasPosgradoRegistrarNotaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasPosgradoRegistrarNotaCtrl = $controller('MateriasPosgradoRegistrarNotaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasPosgradoRegistrarNotaCtrl.awesomeThings.length).toBe(3);
  });
});
