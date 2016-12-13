'use strict';

describe('Controller: DocenteTgsRevisionesCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var DocenteTgsRevisionesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocenteTgsRevisionesCtrl = $controller('DocenteTgsRevisionesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  /*it('should attach a list of awesomeThings to the scope', function () {
    expect(DocenteTgsRevisionesCtrl.awesomeThings.length).toBe(3);
  });*/
});
