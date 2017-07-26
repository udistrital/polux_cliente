'use strict';

describe('Controller: SolicitudesCrearSolicitudCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var SolicitudesCrearSolicitudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolicitudesCrearSolicitudCtrl = $controller('SolicitudesCrearSolicitudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SolicitudesCrearSolicitudCtrl.awesomeThings.length).toBe(3);
  });
});
