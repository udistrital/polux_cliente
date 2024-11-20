
  
'use strict';


/**
 * @ngdoc overview
 * @name notificacionService
 * @description
 * # notificacionService
 */

angular.module('notificacionService', [])
    /**
     * @ngdoc service
     * @name notificacionService.service:notificacionRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @requires $websocket
     * @param {injector} $websocket componente websocket de angular-websocket
     * @param {injector} $websocket componente websocket de angular-websocket
     * @description
     * # notificacion
     * Permite gestionar workflow de notificaciones
     */

    .factory('notificacionRequest', function (CONF,token_service, $http) {
   
        var self=this
        var path = CONF.GENERAL.NOTIFICACION_MID_SERVICE;
        var arm = CONF.GENERAL.ARM_AWS_NOTIFICACIONES;
        var no_vistos = 0;
        var ROL="";
        if (token_service.live_token()) {
            token_service.getLoginData()
                .then(function () {
                    self.token = token_service.getAppPayload();
                    self.roles= token_service.getAppPayload().role;
            if(self.roles==null)
            {
                self.roles= token_service.getAppPayload().appUserRole;
            }
                    ROL=  self.roles;
                    if(ROL!=null && ROL.includes('COORDINADOR'))
                  {
                      
                      ROL =  'COORDINADOR';
                      no_vistos = 1;
                  }
                  if(ROL!=null && ROL.includes('ESTUDIANTE'))
                  {
                      ROL = 'ESTUDIANTE';
                  }
                  if(ROL!=null && ROL.includes('DOCENTE'))
                  {
                      ROL =  'DOCENTE';
                      no_vistos = 1;
                  }
                }).catch(

                )
        }

        return {
            existeNotificaciones:false,
            verificarSuscripcion: function() {
                var elemento={
                    ArnTopic:arm,   
                    Endpoint:"",//self.token.email,
                    
                }
                return $http.post(path + 'notificaciones/suscripcion', elemento, token_service.getHeader());
            },
            suscripcion: function() {            
                var elemento={
                    ArnTopic: arm,
                    Suscritos: [
                      {
                        Endpoint: "",//self.token.email, 

                        Id: self.token.appUserDocument,
                        Protocolo: 'email'
                      }
                    ]
                  }
                return $http.post(path + 'notificaciones/suscribir'+'?atributos=rol:'+ROL, elemento, token_service.getHeader());
              
            },
            enviarCorreo: function(asunto,atributos,destinatarios,idDuplicacion,idGrupoMensaje,mensaje) {
                var elemento={
                    ArnTopic: arm,
                    Asunto:asunto,
                    Atributos:atributos,//objeto
                    DestinatarioId: destinatarios,//arreglo de strings
                    IdDeduplicacion:idDuplicacion,
                    IdGrupoMensaje:idGrupoMensaje,
                    Mensaje:mensaje,
                    RemitenteId:self.token.appUserDocument,
                  }
                return $http.post(path + 'notificaciones/enviar', elemento, token_service.getHeader());
            },
            enviarNotificacion: function(asunto,destinatarioId,mensaje) { 
                var elemento={
                    ArnTopic: arm,
                    Asunto:asunto,
                    Atributos:{
                    },//objeto
                    DestinatarioId: [destinatarioId],//arreglo de strings
                    IdDeduplicacion:'',
                    IdGrupoMensaje:'',
                    Mensaje:mensaje,
                    RemitenteId:self.token.appUserDocument,
                  }
                return $http.post(path + 'notificaciones/enviar', elemento, token_service.getHeader());
              
            },
            traerNotificacion: function(nombreCola) {
                return $http.get(path + 'colas/mensajes?nombre='+nombreCola+'&numMax=10', token_service.getHeader());
            },
            traerNotificaciones: function(nombreCola) {
                return $http.get(path + 'colas/mensajes/espera?nombre='+nombreCola+'&tiempoEspera=5', token_service.getHeader());
            },
            borrarNotificaciones: function(nombreCola,usuarioid) {
                return $http.post(path + 'colas/mensajes/'+nombreCola,usuarioid, token_service.getHeader());
            },
            no_vistos:function(){
                return no_vistos;
                       },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.getHeader());
            },
            changeStateNoView: function () {
                console.log('changeStateNoView')
            }
        };
        });
    