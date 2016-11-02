'use strict';

describe('Controller: PropuestaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var GeneralPropuestaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GeneralPropuestaCtrl = $controller('PropuestaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GeneralPropuestaCtrl.awesomeThings.length).toBe(3);
  });
});
