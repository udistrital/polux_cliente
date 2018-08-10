'use strict';

describe('Directive: trabajoGrado/versionesDocumentosTg', function () {

  // load the directive's module
  beforeEach(module('poluxClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<trabajo-grado/versiones-documentos-tg></trabajo-grado/versiones-documentos-tg>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the trabajoGrado/versionesDocumentosTg directive');
  }));
});
