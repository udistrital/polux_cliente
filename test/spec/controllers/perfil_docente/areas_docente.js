'use strict';

describe('Controller: AreasDocenteCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var AreasDocenteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AreasDocenteCtrl = $controller('AreasDocenteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AreasDocenteCtrl.awesomeThings.length).toBe(3);
  });
});
