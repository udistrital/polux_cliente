'use strict';

describe('Directive: registrarPropuesta', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<registrar-propuesta></registrar-propuesta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the registrarPropuesta directive');
  }));
});
