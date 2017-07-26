'use strict';

describe('Controller: SolicitudesListarSolicitudesCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var SolicitudesListarSolicitudesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolicitudesListarSolicitudesCtrl = $controller('SolicitudesListarSolicitudesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SolicitudesListarSolicitudesCtrl.awesomeThings.length).toBe(3);
  });
});
