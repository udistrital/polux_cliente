'use strict';

describe('Directive: asignarArea', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<asignar-area></asignar-area>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the asignarArea directive');
  }));
});
