'use strict';

describe('Controller: FormatoFormatoEdicionCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var FormatoFormatoEdicionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoFormatoEdicionCtrl = $controller('FormatoFormatoEdicionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoFormatoEdicionCtrl.awesomeThings.length).toBe(3);
  });
});
