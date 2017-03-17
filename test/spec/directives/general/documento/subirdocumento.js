'use strict';

describe('Directive: subirDocumento', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<subir-documento></subir-documento>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the subirDocumento directive');
  }));
});
