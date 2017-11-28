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
    .factory('token_service', function($location, $http, $localStorage, CONF) {
        var service = {
            local: $localStorage.$default(params),
            //session: $sessionStorage.default(params),
            header: null,
            token: null,
            //user: null,
            //all_perfil: null,

            config: {
                AUTORIZATION_URL: CONF.GENERAL.TOKEN.AUTORIZATION_URL,
                CLIENTE_ID: CONF.GENERAL.TOKEN.CLIENTE_ID,
                REDIRECT_URL: CONF.GENERAL.TOKEN.REDIRECT_URL,
                RESPONSE_TYPE: CONF.GENERAL.TOKEN.RESPONSE_TYPE,
                SCOPE: CONF.GENERAL.TOKEN.SCOPE,
                BUTTON_CLASS: CONF.GENERAL.TOKEN.BUTTON_CLASS,
                SIGN_OUT_URL: CONF.GENERAL.TOKEN.SIGN_OUT_URL,
                SIGN_OUT_REDIRECT_URL: CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL,
                SIGN_OUT_APPEND_TOKEN: CONF.GENERAL.TOKEN.SIGN_OUT_APPEND_TOKEN
            },

            live_token: function() {
                if (typeof service.local.id_token === 'undefined' || service.local.id_token === null) {
                    return false;
                } else {
                    service.header = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(service.local.id_token.split(".")[0]));
                    service.token = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(service.local.id_token.split(".")[1]));
                    //service.user = service.token.sub;
                    return true;
                }
            },
            logout: function() {
                window.location = $location.absUrl();
                var url = service.config.SIGN_OUT_URL;
                url = url + '?logout_redirect_uri=' + service.config.SIGN_OUT_REDIRECT_URL;
                url = url + '?id_token_hint=' + service.local.id_token;
                console.log(url);
                service.token = null;
                $localStorage.$reset();
                window.location.replace(url);
            }
        };
        return service;
    });
