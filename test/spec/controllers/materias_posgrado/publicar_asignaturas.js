'use strict';

describe('Controller: MateriasPosgradoPublicarAsignaturasCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var MateriasPosgradoPublicarAsignaturasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriasPosgradoPublicarAsignaturasCtrl = $controller('MateriasPosgradoPublicarAsignaturasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriasPosgradoPublicarAsignaturasCtrl.awesomeThings.length).toBe(3);
  });
});
