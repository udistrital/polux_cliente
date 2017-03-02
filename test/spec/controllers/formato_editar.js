'use strict';

describe('Controller: FormatoEditarCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var FormatoEditarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoEditarCtrl = $controller('FormatoEditarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoEditarCtrl.awesomeThings.length).toBe(3);
  });
});
