'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
 * @description
 * # EstudianteRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('EstudianteRevisionDocumentoCtrl', function(poluxRequest,$route) {
    var self = this;
    self.tgId = 1;
    self.doctgId = 2; //viene por la sesión
    self.doc = 1;
    self.vncdocId = 1;
    self.pagina = 2;
    poluxRequest.get("revision", $.param({
      query: "IdDocumentoTg:" + self.doctgId + ",IdVinculacionDocente:" + self.vncdocId,
      sortby: "Id",
      order: "asc",
      limit:0
    })).then(function(response) {
      self.revisionesd = response.data;
      self.numRevisiones=response.data.length;
    });

    poluxRequest.get("vinculacion_docente", $.param({
      query: "Id:" + self.vncdocId
    })).then(function(response) {
      self.vinculacion_info = response.data[0];
    });
    self.solicitar_revision = function() {
      swal({
        title: 'Solicitud de Revision?',
        text: "Desea realizar la solicitud de revision para " + self.vinculacion_info.IdTrabajoGrado.Titulo + "al docente " + self.vinculacion_info.IdentificacionDocente,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
      }).then(function() {
        var revision = {
          IdDocumentoTg: {
            Id: self.doctgId
          },
          IdVinculacionDocente: {
            Id: self.vncdocId
          },
          NumeroRevision: self.revisionesd[self.numRevisiones-1].NumeroRevision+1,
          Estado: "pendiente",
          FechaRecepcion: new Date()
        };

        self.solicitarev=true;
        for (var i = 0; i < self.revisionesd .length; i++) {
          if(self.revisionesd [i].Estado==="pendiente" || self.revisionesd [i].Estado==="borrador"){
            self.solicitarev=false;
            break;
          }
        }

        if (self.solicitarev) {
          poluxRequest.post("revision", revision).then(function(response) {
            console.log(response.data);
            swal(
              'Revision Solicitada',
              'la revision No ' + response.data.NumeroRevision + " fue solicitada exitosamente",
              'success'
            );
            $route.reload();
          });
        } else {
          swal(
            'Revision No Solicitada',
            'la revision ya se encuentra solicitada',
            'warning'
          );
        }



      });
    };

  });
