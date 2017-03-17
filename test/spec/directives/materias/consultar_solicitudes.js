'use strict';

describe('Directive: materias/consultarSolicitudes', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<materias/consultar-solicitudes></materias/consultar-solicitudes>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the materias/consultarSolicitudes directive');
  }));
});
