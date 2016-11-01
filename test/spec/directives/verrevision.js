'use strict';

describe('Directive: verRevision', function () {

  // load the directive's module
  beforeEach(module('poluxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ver-revision></ver-revision>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the verRevision directive');
  }));
});
