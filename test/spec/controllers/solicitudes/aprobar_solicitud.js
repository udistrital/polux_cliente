'use strict';

describe('Controller: SolicitudesAprobarSolicitudCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var SolicitudesAprobarSolicitudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolicitudesAprobarSolicitudCtrl = $controller('SolicitudesAprobarSolicitudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SolicitudesAprobarSolicitudCtrl.awesomeThings.length).toBe(3);
  });
});
