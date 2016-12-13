'use strict';

describe('Directive: formEvalucion', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  /*it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<form-evalucion></form-evalucion>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the formEvalucion directive');
  }));*/
});
