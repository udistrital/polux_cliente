'use strict';

describe('Controller: DocenteTgsCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var DocenteTgsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocenteTgsCtrl = $controller('DocenteTgsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
/*
  it('should attach a list of awesomeThings to the scope', function () {
    expect(DocenteTgsCtrl.awesomeThings.length).toBe(3);
  });*/
});
