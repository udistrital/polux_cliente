'use strict';

/**
 * @ngdoc overview
 * @name implicitToken
 * @description
 * # implicitToken
 * Service in the implicitToken.
 */
// First, parse the query string
var logout_valid = false;
var access_token_init = window.localStorage.getItem('access_token');
if (access_token_init === null || access_token_init === undefined) {
  var params = {},
    queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g;
  var m;
  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  // And send the token over to the server
  var req = new XMLHttpRequest();
  // consider using POST so query isn't logged
  var query = 'https://' + window.location.host + '?' + queryString;
  // console.log(query);
  req.open('GET', query, true);
  if (params['id_token'] !== null && params['id_token'] !== undefined) {
    window.localStorage.setItem('access_token', params['access_token']);
    window.localStorage.setItem('id_token', params['id_token']);
    window.localStorage.setItem('state', params['state']);
    window.localStorage.setItem('expires_in', params['expires_in']);
  } else {
    window.localStorage.clear();
  }
  req.onreadystatechange = function (e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        // window.location = params.state;
      } else if (req.status === 400) {
        window.alert('There was an error processing the token.');
      } else {
        // alert('something else other than 200 was returned');
        // console.log(req);
      }
    }
  };
} else {
  var state;
  logout_valid = true;
  var queryString = location.search.substring(1);
  var regex = /([^&=]+)=([^&]*)/g;
  var m;
  while (!!(m = regex.exec(queryString))) {
    state = decodeURIComponent(m[2]);
  }
  if (window.localStorage.getItem('state') === state) {
    logout_valid = true;
  } else {
    logout_valid = false;
  }
}

angular.module('implicitToken', [])
  .factory('token_service', function (CONF, md5, $interval, $http) {

    var service = {
      //session: $localStorage.default(params),
      header: null,
      token: null,
      logout_url: null,
      userInfo: null,
      dataUserPromise: null,
      logoutValid: logout_valid,
      logginned: false,
      generateState: function () {
        var text = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
        return md5.createHash(text);
      },
      setting_bearer: {
        headers: {}
      },
      getHeader: function () {
        service.setting_bearer = {
          headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
          }
        };
        return service.setting_bearer;
      },
      isLogout: function () {
        if (service.logoutValid) {
          if (typeof CONF.GENERAL.TOKEN.LOGOUT_REDIRECT !== 'undefined') {
            window.location = CONF.GENERAL.TOKEN.LOGOUT_REDIRECT;
          } else {
            window.location = CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL;
          }
          service.clearStorage();
        }
        return service.logoutValid;
      },
      login: function () {
        if (!service.isLogout()) {
          if (!CONF.GENERAL.TOKEN.nonce) {
            CONF.GENERAL.TOKEN.nonce = service.generateState();
          }
          if (!CONF.GENERAL.TOKEN.state) {
            CONF.GENERAL.TOKEN.state = service.generateState();
          }
          var url = CONF.GENERAL.TOKEN.AUTORIZATION_URL + '?' +
            'client_id=' + encodeURIComponent(CONF.GENERAL.TOKEN.CLIENTE_ID) + '&' +
            'redirect_uri=' + encodeURIComponent(CONF.GENERAL.TOKEN.REDIRECT_URL) + '&' +
            'response_type=' + encodeURIComponent(CONF.GENERAL.TOKEN.RESPONSE_TYPE) + '&' +
            'scope=' + encodeURIComponent(CONF.GENERAL.TOKEN.SCOPE);
          if (CONF.GENERAL.TOKEN.nonce) {
            url += '&nonce=' + encodeURIComponent(CONF.GENERAL.TOKEN.nonce);
          }
          url += '&state=' + encodeURIComponent(CONF.GENERAL.TOKEN.state);
          window.location = url;
          return url;
        }
      },
      live_token: function () {
        const idToken = window.localStorage.getItem('id_token');
        if (idToken === undefined || idToken === null) {
          service.login();
          service.logginned = false;
        } else {
          service.setting_bearer = {
            headers: {
              'Accept': 'application/json',
              "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
            }
          };
          service.logout_url = CONF.GENERAL.TOKEN.SIGN_OUT_URL;
          service.logout_url += '?id_token_hint=' + window.localStorage.getItem('id_token');
          service.logout_url += '&post_logout_redirect_uri=' + CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL;
          service.logout_url += '&state=' + window.localStorage.getItem('state');
          service.logginned = true;
        }
        return service.logginned;
      },
      getPayload: function () {
        var id_token = window.localStorage.getItem('id_token').split('.');
        return JSON.parse(atob(id_token[1]));
      },
      getAppPayload: function () {
        var id_token = window.localStorage.getItem('id_token').split('.');
        var access_code = window.localStorage.getItem('access_code');
        var access_role = window.localStorage.getItem('access_role');
        var data = JSON.parse(atob(id_token[1]));
        data.appUserDocument = JSON.parse(atob(access_code));
        data.appUserRole = JSON.parse(atob(access_role));
        return data;
      },
      getPayload2: function () {
        let appUserDocument;
        let appUserRole;

        if (service.dataUserPromise === null) {
          service.dataUserPromise = new Promise(function (resolve) {
            var id_token = window.localStorage.getItem('id_token');
            if (id_token !== null) {
              service.setting_bearer = {
                headers: {
                  'Accept': 'application/json',
                  "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
                }
              };
              var id_token_array = id_token.split('.')
              var payload = JSON.parse(atob(id_token_array[1]));
              var body = { user: payload.email };

              if (service.dataUserPromise === null) {
                $http.post(CONF.GENERAL.TOKEN.AUTENTICACION_MID, body, service.setting_bearer)
                  .then(function (userInfo) {
                    if (userInfo.data.Codigo !== '' && userInfo.data.role.includes("ESTUDIANTE")) {
                      appUserDocument = userInfo.data.Codigo;
                    } else {
                      appUserDocument = userInfo.data.documento;
                    }
                    appUserRole = userInfo.data.role;
                    window.localStorage.setItem('access_code', btoa(JSON.stringify(appUserDocument)));
                    window.localStorage.setItem('access_role', btoa(JSON.stringify(appUserRole)));

                    service.userInfo = userInfo.data;
                    resolve(service.userInfo);
                  });
              }
            }
          });
        }
        return service.dataUserPromise;
      },

      logout: function () {
        service.logout_url = CONF.GENERAL.TOKEN.SIGN_OUT_URL;
        service.logout_url += '?id_token_hint=' + window.localStorage.getItem('id_token');
        service.logout_url += '&post_logout_redirect_uri=' + CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL;
        service.logout_url += '&state=' + window.localStorage.getItem('state');
        window.location.replace(service.logout_url);
      },

      expired: function () {
        return (new Date(window.localStorage.getItem('expires_at')) < new Date());
      },

      setExpiresAt: function () {
        service.isLogout();
        var expires_at_local = window.localStorage.getItem('expires_at');
        var expires_at = new Date();
        if (expires_at_local === null) {
          expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in')) - 40); // 40 seconds less to secure browser and response latency
          window.localStorage.setItem('expires_at', expires_at);
        }
        if (expires_at == 'Invalid Date') {
          service.clearStorage();
        }
        if (service.expired()) {
          expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in')));
          if (expires_at < new Date(window.localStorage.getItem('expires_at'))) {
            service.logout();
          } else {
            service.clearStorage();
          }
        }
      },

      timer: function () {
        var expires_at = window.localStorage.getItem('expires_at');
        if (expires_at !== null && expires_at !== 'Invalid Date') {
          $interval(function () {
            if (service.expired()) {
              service.logout();
            }
          }, 5000);
        } else {
          service.clearStorage();
        }
      },


      clearStorage: function () {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('id_token');
        window.localStorage.removeItem('expires_in');
        window.localStorage.removeItem('state');
        window.localStorage.removeItem('expires_at');
      }
    };
    service.isLogout();
    service.setExpiresAt();
    service.timer();
    service.live_token();
    return service;
  });
