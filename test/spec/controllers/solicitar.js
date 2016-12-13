'use strict';

describe('Controller: SolicitarCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var SolicitarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolicitarCtrl = $controller('SolicitarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
/*
  it('should attach a list of awesomeThings to the scope', function () {
    expect(SolicitarCtrl.awesomeThings.length).toBe(3);
  });*/
});
