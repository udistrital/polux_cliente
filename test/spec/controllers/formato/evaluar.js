'use strict';

describe('Controller: FormatoEvaluarCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var FormatoEvaluarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoEvaluarCtrl = $controller('FormatoEvaluarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoEvaluarCtrl.awesomeThings.length).toBe(3);
  });
});
