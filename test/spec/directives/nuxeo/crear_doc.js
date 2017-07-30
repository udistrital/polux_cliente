'use strict';

describe('Directive: nuxeo/crearDoc', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nuxeo/crear-doc></nuxeo/crear-doc>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the nuxeo/crearDoc directive');
  }));
});
