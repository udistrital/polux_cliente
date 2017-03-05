'use strict';

describe('Directive: materias/publicarAsignaturas', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<materias/publicar-asignaturas></materias/publicar-asignaturas>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the materias/publicarAsignaturas directive');
  }));
});
