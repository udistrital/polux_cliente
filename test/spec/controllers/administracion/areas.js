'use strict';

describe('Controller: AdministracionAreasCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var AdministracionAreasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdministracionAreasCtrl = $controller('AdministracionAreasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AdministracionAreasCtrl.awesomeThings.length).toBe(3);
  });
});
