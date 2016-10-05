'use strict';

describe('Directive: busquedaEntidad', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<busqueda-entidad></busqueda-entidad>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the busquedaEntidad directive');
  }));
});
