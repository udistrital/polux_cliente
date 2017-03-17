'use strict';

describe('Controller: DocenteTgsRevisionDocumentoCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var DocenteTgsRevisionDocumentoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocenteTgsRevisionDocumentoCtrl = $controller('DocenteTgsRevisionDocumentoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DocenteTgsRevisionDocumentoCtrl.awesomeThings.length).toBe(3);
  });
});
