'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.utilidadesreq 
 * @description 
 * # poluxRequest
 * Factory in the poluxcrud.
 */
angular.module('utilsService', [])
    .factory('utils', function ($http, CONF, $translate) {
          // Public API here
        

          function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);           
                reader.onload = () => {
                    let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                    if ((encoded.length % 4) > 0) {
                        encoded += '='.repeat(4 - (encoded.length % 4));
                    }                   
                    resolve(encoded);
                };
                reader.onerror = error => reject(error);
            });
        }
        
          return {          
            getBase64: async (file) => {
                var base64;
                await fileToBase64(file).then(data => {
                    base64 = data;
                    return null;
                });
                return base64;
            },
            base64ToArrayBuffer: function (base64) {
                var binary_string = window.atob(base64.replace(/\s/g,''));
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
            },
            FormatoNumero: function (amount, decimals) {

                amount += '';
                amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));
    
                decimals = decimals || 0;
    
                if (isNaN(amount) || amount === 0) {
                    return parseFloat(0).toFixed(decimals);
                }
    
                amount = '' + amount.toFixed(decimals);
    
                var amount_parts = amount.split('.'),
                    regexp = /(\d+)(\d{3})/;
    
                while (regexp.test(amount_parts[0])) {
                    amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
                }
    
                return amount_parts.join('.');
            },
            numeroALetras: function (numero) {
                if (numero === 0) {
                    return 'CERO ';
                } else {
                    return getDecenas(numero);
                }
            },
            nombreMes: function(mesNum){
                return meses[mesNum-1]
            },
            mesAnterior: function (mes, anio) {
                var mes_anterior;
                var anio_anterior;
                if(mes===1){
                    mes_anterior= 12;
                    anio_anterior=anio-1;
                }else{
                    mes_anterior= mes-1;
                    anio_anterior=anio;
                }
            }
        };
    });
 