'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.token
 * @description
 * # token
 * Factory in the poluxClienteApp.
 */


// First, parse the query string
var params = {},
    queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g,
    m;
while (!!(m = regex.exec(queryString))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
// And send the token over to the server
var req = new XMLHttpRequest();
// consider using POST so query isn't logged
var query = 'https://' + window.location.host + '?' + queryString;
//console.log(query);
req.open('GET', query, true);

req.onreadystatechange = function(e) {
    console.log(e);
    if (req.readyState === 4) {
        if (req.status === 200) {
            window.location = params.state;
        } else if (req.status === 400) {
            window.alert('There was an error processing the token.');
        } else {
            //alert('something else other than 200 was returned');
            //console.log(req);
        }

    }
};

angular.module('poluxClienteApp')
    .factory('token_service', function($location, $http, $localStorage) {
        var service = {
            local: $localStorage.$default(params),
            //session: $sessionStorage.default(params),
            header: null,
            token: null,
            user: null,
            all_perfil: null,

            config: {
                AUTORIZATION_URL: "https://wso2.udistritaloas.edu.co:9443/oauth2/authorize",
                CLIENTE_ID: "3QSGwu9AsnyV69SNTPAIDQtb9A0a",
                REDIRECT_URL: "http://10.20.0.254/polux",
                RESPONSE_TYPE: "id_token token",
                SCOPE: "openid profile email",
                BUTTON_CLASS: "btn btn-outline btn-primary btn-sm"
            },
            live_token: function() {
                if (typeof service.local.id_token === 'undefined' || service.local.id_token === null) {
                    return false;
                } else {
                    service.header = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(service.local.id_token.split(".")[0]));
                    service.token = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(service.local.id_token.split(".")[1]));
                    service.user = service.token.sub;
                    return true;
                }
            },
            logout: function() {
                service.token = null;
                $localStorage.$reset();
                window.location = $location.absUrl();
            }
        };
        return service;
    });