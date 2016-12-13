'use strict';

describe('Directive: mostrarArea', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  /*it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mostrar-area></mostrar-area>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mostrarArea directive');
  }));*/
});
