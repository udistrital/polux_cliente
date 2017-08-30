'use strict';

describe('Controller: GestionSolicitudesSolicitudesCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var GestionSolicitudesSolicitudesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GestionSolicitudesSolicitudesCtrl = $controller('GestionSolicitudesSolicitudesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GestionSolicitudesSolicitudesCtrl.awesomeThings.length).toBe(3);
  });
});
