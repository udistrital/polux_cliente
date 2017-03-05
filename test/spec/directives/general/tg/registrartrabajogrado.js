'use strict';

describe('Directive: registrarTrabajoGrado', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<registrar-trabajo-grado></registrar-trabajo-grado>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the registrarTrabajoGrado directive');
  }));
});
