'use strict';

describe('Controller: FormEvaluacionCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxApp'));

  var FormEvaluacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormEvaluacionCtrl = $controller('FormEvaluacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
/*
  it('should attach a list of awesomeThings to the scope', function () {
    expect(FormEvaluacionCtrl.awesomeThings.length).toBe(3);
  });*/
});
