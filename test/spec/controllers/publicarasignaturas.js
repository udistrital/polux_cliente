'use strict';

describe('Controller: PublicarasignaturasCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var PublicarasignaturasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PublicarasignaturasCtrl = $controller('PublicarasignaturasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PublicarasignaturasCtrl.awesomeThings.length).toBe(3);
  });
});
