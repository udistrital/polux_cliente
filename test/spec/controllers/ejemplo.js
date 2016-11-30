'use strict';

describe('Controller: EjemploCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var EjemploCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EjemploCtrl = $controller('EjemploCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EjemploCtrl.awesomeThings.length).toBe(3);
  });
});
