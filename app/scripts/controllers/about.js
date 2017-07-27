'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('AboutCtrl', function (nuxeo, $scope) {
    var ctrl = this;


    $scope.search = {
        masters: {},
        mediaTypes: {'Picture': true, 'Audio': false, 'Video': false, 'Note': false, 'File': false},
        tags: [],
        terms: '',

        advanced: {
          myMediaOnly: false,
          continents: {},
          selectedContinent: null,
          countries: {},
          selectedCountry: null,
          natures: {},
          selectedNature: null,
          subjects: {},
          selectedSubject: null
        },

        upload: {}
      };

      $scope.documents = {
        pageIndex: 0
      };

          $scope.fn = {
        isActive: function (type) {
          return $scope.search.mediaTypes[type] === true;
        },
        toggle: function (type) {
          angular.forEach($scope.search.mediaTypes, function (v, k) {
            if (k === type) {
              $scope.search.mediaTypes[type] = !$scope.search.mediaTypes[type];
            } else {
              $scope.search.mediaTypes[k] = false;
            }
          });
          $scope.search.mediaTypes = angular.copy($scope.search.mediaTypes);
        },
        upload: function () {
          var file = document.getElementById('file');
          nuxeo.upload(file, $scope.uiChange, function () {
            window.alert('An error occurred uploading document');
          });
        }
      };

    ctrl.nuxeo = nuxeo;
        nuxeo.connect().then(function(client) {
      // OK, the returned client is connected
      console.log('Client is connected: ' + client.connected);
    }, function(err) {
      // cannot connect
      console.log('Client is not connected: ' + err);
    });

    nuxeo.operation('Document.')
  .input('5ab59292-0c0e-4326-ba62-3f81eae24aac')
  .execute()
  .then(function(docs) {
    console.log(docs);
  })
  .catch(function(error) {
    // something went wrong
    throw error;
  });


  });
