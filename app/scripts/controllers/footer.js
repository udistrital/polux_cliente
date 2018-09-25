'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:footerCtrl
 * @description
 * # AboutCtrl
 * Controller of the poluxClienteApp.
 * Controlador del footer del proyecto.
 * @property {array} enlaces_universitarios Enlaces que pueden ser de interes y se muestran en el footer.
 * @property {string} copyright Derechos de la aplicación.
 * @property {array} map Otros enlaces que también pueden ser de interes.
 */
angular.module('poluxClienteApp')
  .controller("footerCtrl", function ($scope) {
    //var ctrl = this;
    $scope.enlaces_universitarios = [{
      nombre: "Transparencia",
      link: "#/"
    }, {
      nombre: "Normatividad",
      link: "#/"
    }, {
      nombre: "Trámites",
      link: "#/"
    }, {
      nombre: "General",
      link: "#/"
    }, {
      nombre: "Docente",
      link: "#/"
    }, {
      nombre: "Académica Estudiantil ",
      link: "#/"
    }, {
      nombre: "Derechos Pecuniarios",
      link: "#/"
    }, {
      nombre: "Sistema de Notificaciones",
      link: "#/"
    }, {
      nombre: "CSU",
      link: "#/"
    }, {
      nombre: "PIGA",
      link: "#/"
    }, {
      nombre: "Bitácora",
      link: "#/"
    }, {
      nombre: "Noticias anterioresg",
      link: "#/"
    }, {
      nombre: "Área de Red UDNet",
      link: "#/"
    }, {
      nombre: "Administración PWI",
      link: "#/"
    }];
    $scope.copyright = "© Copyright 1995 - 2017 - Todos los Derechos Reservados ...";
    $scope.map = [{
      nombre: "Preguntas Frecuentes",
      link: "#/"
    }, {
      nombre: "Mapa del Porta",
      link: "#/"
    }, {
      nombre: "Política de Privacidad",
      link: "#/"
    }];
  });
