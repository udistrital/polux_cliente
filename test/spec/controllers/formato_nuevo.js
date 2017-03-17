'use strict';

describe('Controller: FormatoNuevoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var FormatoNuevoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoNuevoCtrl = $controller('FormatoNuevoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoNuevoCtrl.awesomeThings.length).toBe(3);
  });
});
