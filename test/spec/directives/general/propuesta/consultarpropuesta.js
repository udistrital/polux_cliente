'use strict';

describe('Directive: consultarPropuesta', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<consultar-propuesta></consultar-propuesta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the consultarPropuesta directive');
  }));
});
