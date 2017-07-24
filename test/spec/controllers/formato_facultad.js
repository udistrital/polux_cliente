'use strict';

describe('Controller: FormatoFacultadCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var FormatoFacultadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoFacultadCtrl = $controller('FormatoFacultadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoFacultadCtrl.awesomeThings.length).toBe(3);
  });
});
