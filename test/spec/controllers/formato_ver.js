'use strict';

describe('Controller: FormatoVerCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var FormatoVerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormatoVerCtrl = $controller('FormatoVerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormatoVerCtrl.awesomeThings.length).toBe(3);
  });
});
