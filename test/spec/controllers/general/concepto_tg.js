'use strict';

describe('Controller: GeneralConceptoTgCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var GeneralConceptoTgCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GeneralConceptoTgCtrl = $controller('GeneralConceptoTgCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GeneralConceptoTgCtrl.awesomeThings.length).toBe(3);
  });
});
