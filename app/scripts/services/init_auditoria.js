(function () {
  angular.element(document).ready(function () {
    try {
      var injector = angular.element(document.body).injector();
      var CONF = injector.get("CONF");

      const urlAuditoria = CONF.GENERAL.AUDITORIA;
      const script = document.createElement("script");
      script.src = urlAuditoria;
      script.setAttribute("data-mf", "auditoria");
      document.body.appendChild(script);
    } catch (e) {
      console.error("Error cargando auditoría:", e);
    }
  });
})();
