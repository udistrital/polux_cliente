'use strict';

describe('Controller: EstudianteRevisionDocumentoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var EstudianteRevisionDocumentoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EstudianteRevisionDocumentoCtrl = $controller('EstudianteRevisionDocumentoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EstudianteRevisionDocumentoCtrl.awesomeThings.length).toBe(3);
  });
});
