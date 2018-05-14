'use strict';

describe('Controller: GeneralConsultarTrabajoGradoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var GeneralConsultarTrabajoGradoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GeneralConsultarTrabajoGradoCtrl = $controller('GeneralConsultarTrabajoGradoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GeneralConsultarTrabajoGradoCtrl.awesomeThings.length).toBe(3);
  });
});
