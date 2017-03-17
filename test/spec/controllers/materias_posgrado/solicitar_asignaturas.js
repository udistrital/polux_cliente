'use strict';

describe('Controller: MateriasPosgradoSolicitarAsignaturasCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var MateriasPosgradoSolicitarAsignaturasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasPosgradoSolicitarAsignaturasCtrl = $controller('MateriasPosgradoSolicitarAsignaturasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasPosgradoSolicitarAsignaturasCtrl.awesomeThings.length).toBe(3);
  });
});
