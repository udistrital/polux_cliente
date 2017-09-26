'use strict';

describe('Directive: btnRegistro', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<btn-registro></btn-registro>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the btnRegistro directive');
  }));
});
