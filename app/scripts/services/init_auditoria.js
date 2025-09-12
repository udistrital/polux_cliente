angular.module('poluxClienteApp')
  .run(['CONF', function(CONF) {
    var script = document.createElement("script");
    script.src = CONF.GENERAL.AUDITORIA;
    script.setAttribute("data-mf", "auditoria");
    document.body.appendChild(script);
  }]);