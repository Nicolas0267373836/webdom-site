/*
  Adaptador para las plantillas de muestra exportadas del editor de diseño.
  Les aplica los valores predeterminados de marca para que puedan verse como
  páginas estáticas independientes, sin depender del editor original.
*/
(function () {
  window.DCLogic = window.DCLogic || class {};

  function applyTemplateDefaults() {
    var propsNode = document.querySelector('script[data-dc-script][data-props]');
    if (!propsNode) return;

    var props;
    try {
      props = JSON.parse(propsNode.getAttribute('data-props') || '{}');
    } catch (error) {
      return;
    }

    var pages = document.querySelectorAll('.page');
    Object.keys(props).forEach(function (key) {
      var value = props[key] && props[key].default;
      if (!value) return;
      pages.forEach(function (page) {
        page.style.setProperty('--' + key, value);
      });
    });

    var titles = {
      'Basico-Dentista.dc.html': 'Plantilla Básico — Dentista',
      'Basico-Nutriologo.dc.html': 'Plantilla Básico — Nutriólogo/a',
      'Basico-Pediatria.dc.html': 'Plantilla Básico — Pediatría',
      'Estandar-Dentista.dc.html': 'Plantilla Estándar — Dentista',
      'Estandar-Nutriologo.dc.html': 'Plantilla Estándar — Nutriólogo/a',
      'Estandar-Pediatria.dc.html': 'Plantilla Estándar — Pediatría',
      'Premium-Dentista.dc.html': 'Plantilla Premium — Dentista',
      'Premium-Nutriologo.dc.html': 'Plantilla Premium — Nutriólogo/a',
      'Premium-Pediatria.dc.html': 'Plantilla Premium — Pediatría'
    };
    var filename = window.location.pathname.split('/').pop();
    document.title = (titles[filename] || 'Plantilla médica') + ' | WebDom';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTemplateDefaults, { once: true });
  } else {
    applyTemplateDefaults();
  }
})();
