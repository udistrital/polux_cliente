'use strict';
/**
 * @ngdoc function
 * poluxClienteApp.controller:Notificaciones
 * @name poluxClienteApp.controller:notificacionesCtrl
 * @description
 * # menuaplicacionesCtrl
 * Controller of Polux
 */

//arn de cola arn:aws:sqs:us-east-1:699001025740:test-PoluxCola
//arn de colaDocente arn:aws:sqs:us-east-1:699001025740:test-PoluxColaDocente
angular.module('poluxClienteApp').controller('notificacionesCtrla',
        function (notificacionRequest,$translate, $scope,token_service,$location) {
            $scope.roles= token_service.getAppPayload().role;
            if($scope.roles==null)
            {
                $scope.roles= token_service.getAppPayload().appUserRole;
            }
            $scope.documento= token_service.getAppPayload().appUserDocument;
            $scope.notificacion = notificacionRequest;
            $scope.notificacion.existeNotificaciones=false;
            $scope.notificaciones = {}; 
            $scope.mensajeError="";         
            $scope.load=true;
            $scope.loading=false;
            $scope.cola = null;
            $scope.a = "Verifi";
            $scope.prueba= "/solicitudes/listar_solicitudes";
            $scope.nombreColaCoordinador="PoluxCola";
            $scope.nombreColaDocente="PoluxColaDocente";
           
            function traerNoticicaciones() {
                
                if($scope.roles.includes('COORDINADOR') || $scope.roles.includes('COORDINADOR_POSGRADO')){    
                    
                    notificacionRequest.traerNotificaciones( $scope.nombreColaCoordinador).then(function (response) {
                  
                        if(response.data.Data!=null){
                            $scope.existenNotificaciones=true;
                            $scope.notificacion.existeNotificaciones=true;
                            $scope.url_redirect=response.data.Data[0].Body.Message;
                            $scope.notificaciones = response.data.Data;  
                            $scope.load=false;
                            $scope.cola = $scope.nombreColaCoordinador;
                     

                           
                        }else{
                            $scope.loading=true;
                            $scope.load=false;
                            $scope.existenNotificaciones=false;
                            $scope.mensajeError = $translate.instant("SIN_NOTIFICACIONES");
                        }
                    }).catch(
                        function (error) {
                            console.log(error)
                        }
                    );
                }else{
                    if($scope.roles!=null && $scope.roles.includes('DOCENTE')){
                        notificacionRequest.traerNotificaciones( $scope.nombreColaDocente).then(function (response) {
                         
                            if(response.data.Data!=null){
                                $scope.existenNotificaciones=true;
                                $scope.notificacion.existeNotificaciones=true;
                                $scope.url_redirect=response.data.Data[0].Body.Message;
                                $scope.notificaciones = response.data.Data;
                                $scope.load=false;
                                $scope.cola = $scope.nombreColaDocente;
                               
                            }else{
                                  
                                $scope.loading=true;
                                $scope.load=false;
                                $scope.existenNotificaciones=false;
                                $scope.mensajeError = $translate.instant("SIN_NOTIFICACIONES");
                            }
                        }).catch(
                            function (error) {
                                console.log(error)
                            }
                        );
                    }
                }
                 
            }

                $scope.redirect_url = function (url) {
               // notificacionRequest.enviarNotificacion('Solicitud de prueba de POLUX 1'+' de REVISION de proyecto','PoluxColaDocente','/solicitudes/listar_solicitudes');               
               //notificacionRequest.enviarNotificacion('Solicitud de prueba de POLUX 2'+' de REVISION de proyecto','PoluxCola','/solicitudes/listar_solicitudes');               
               //notificacionRequest.enviarNotificacion('Solicitud de prueba de POLUX 123'+' de REVISION de proyecto','PoluxColaDocente','/solicitudes/listar_solicitudes');               
               //  notificacionRequest.enviarNotificacion('Solicitud de prueba de POLUX 134'+' de REVISION de proyecto','PoluxCola','/solicitudes/listar_solicitudes');              
                //$scope.Borrar(borrarid);
                //(asunto,{},[destinatario],'','',mensaje,remitenteId)
                
                $location.path(url);
               /* var Atributos={
                    rol:'COORDINADOR',
                }
              notificacionRequest.enviarCorreo('Mensaje de prueba para POLUX',Atributos,['101850341'],'','','Se ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de pruebas para la solicitud.Cuando se desee observar /n el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');              
               */
               
                         
            };
            
            $scope.Borrar = function (borrarid) {
               
                var json_borrar = null;
                for (var i = 0; i < document.getElementById("seleccionnotifi").options.length; i++) {
                    if(document.getElementById("seleccionnotifi").options[i].selected ==true){      
                          
                      // json_borrar= Object.values((document.getElementById('seleccionnotifi').options[i].value));
                      json_borrar=  document.getElementById('seleccionnotifi').options[i].value;
                      console.log(json_borrar,$scope.cola);
                      notificacionRequest.borrarNotificaciones($scope.cola,json_borrar).then(function(response)
            {
                    if(response)
                    {
                        $translate.instant("Se ha eliminado correctamente")
                        'warning' 
                $location.path("/notificaciones");
                traerNoticicaciones()
                    }
                    else
                    {
                        $translate.instant("ERROR.NOTIFICACIONES_ELIMINADA")
                        $translate.instant("VERIFICAR_CONEXION")
                        'warning'
                    }
            });
                      }
                  }
            
           
           
            };
                          
                traerNoticicaciones()
                     
            
          
        });