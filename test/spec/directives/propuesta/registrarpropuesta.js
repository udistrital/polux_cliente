'use strict';

describe('Directive: propuesta/registrarPropuesta', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<propuesta/registrar-propuesta></propuesta/registrar-propuesta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the propuesta/registrarPropuesta directive');
  }));
});
