// ===========================================================
// TIGA -- Demo de rol y acceso (widget flotante)
// Modulo aditivo e independiente de main.js
// Guarda el estado en localStorage para simular sesion entre paginas
// ===========================================================
(function () {
  var KEY_ROLE = 'tiga_role';
  var KEY_ACCESS = 'tiga_access';

  function getRole() { return localStorage.getItem(KEY_ROLE) || 'docente'; }
  function getAccess() { return localStorage.getItem(KEY_ACCESS) || 'demo'; }
  function setRole(r) { localStorage.setItem(KEY_ROLE, r); apply(); }
  function setAccess(a) { localStorage.setItem(KEY_ACCESS, a); apply(); }

  function pathTo(file) {
    return location.pathname.indexOf('/pages/') !== -1 ? file : 'pages/' + file;
  }

  function applyRoleVisibility(role) {
    var nodes = document.querySelectorAll('[data-role-only]');
    nodes.forEach(function (el) {
      var allowed = el.getAttribute('data-role-only').split(',').map(function (s) { return s.trim(); });
      el.classList.toggle('tiga-role-hidden', allowed.indexOf(role) === -1);
    });
  }

  function applyAccessGating(access) {
    var nodes = document.querySelectorAll('[data-requires="premium"]');
    nodes.forEach(function (el) {
      var overlay = el.querySelector(':scope > .tiga-lock-overlay');
      if (access === 'premium') {
        if (overlay) overlay.remove();
      } else if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'tiga-lock-overlay';
        overlay.innerHTML =
          '<span class="lock-icon">\uD83D\uDD12</span>' +
          '<span class="lock-msg">Contenido Premium</span>' +
          '<button class="lock-cta" type="button">Ver planes</button>';
        overlay.querySelector('.lock-cta').addEventListener('click', function (e) {
          e.stopPropagation();
          window.location.href = pathTo('premium.html');
        });
        el.appendChild(overlay);
      }
    });
  }

  function updateWidgetUI(role, access) {
    document.querySelectorAll('.tiga-chip[data-role]').forEach(function (c) {
      c.classList.toggle('active', c.getAttribute('data-role') === role);
    });
    document.querySelectorAll('.tiga-chip[data-access]').forEach(function (c) {
      c.classList.toggle('active', c.getAttribute('data-access') === access);
    });
    var fab = document.querySelector('.tiga-fab');
    if (fab) {
      fab.textContent = role === 'docente' ? '\uD83C\uDF93' : '\uD83C\uDFDB\uFE0F';
    }
    var tag = document.querySelector('.tiga-fab-tag');
    if (tag) {
      var roleLabel = role === 'docente' ? 'Docente' : 'Autoridad';
      var accessLabel = access === 'premium' ? 'Premium' : 'Demo';
      tag.textContent = roleLabel + ' \u00B7 ' + accessLabel;
    }
  }

  function apply() {
    var role = getRole();
    var access = getAccess();
    document.body.setAttribute('data-role', role);
    document.body.setAttribute('data-access', access);
    applyRoleVisibility(role);
    applyAccessGating(access);
    updateWidgetUI(role, access);
  }

  function buildWidget() {
    var wrap = document.createElement('div');
    wrap.className = 'tiga-fab-wrap';

    var tag = document.createElement('div');
    tag.className = 'tiga-fab-tag';
    tag.textContent = 'Docente \u00B7 Demo';

    var fab = document.createElement('button');
    fab.className = 'tiga-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Vista de demostracion TIGA');
    fab.textContent = '\uD83C\uDF93';

    var panel = document.createElement('div');
    panel.className = 'tiga-panel';
    panel.innerHTML =
      '<button class="tiga-close" type="button" aria-label="Cerrar">\u2715</button>' +
      '<h5>Modo demostraci\u00F3n</h5>' +
      '<div class="tiga-sub">Simula c\u00F3mo ve el sistema cada perfil, sin crear cuentas reales.</div>' +
      '<div class="tiga-group-label">Ver como</div>' +
      '<div class="tiga-row" data-group="role">' +
      '  <div class="tiga-chip" data-role="docente">Docente</div>' +
      '  <div class="tiga-chip" data-role="autoridad">Autoridad</div>' +
      '</div>' +
      '<div class="tiga-group-label">Nivel de acceso</div>' +
      '<div class="tiga-row" data-group="access">' +
      '  <div class="tiga-chip" data-access="demo">Demo</div>' +
      '  <div class="tiga-chip" data-access="premium">Premium</div>' +
      '</div>' +
      '<div class="tiga-note">Cambia estas opciones para mostrar el sistema a distintos perfiles en una reuni\u00F3n o demo.</div>';

    document.body.appendChild(wrap);
    wrap.appendChild(tag);
    wrap.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', function () { panel.classList.toggle('open'); });
    panel.querySelector('.tiga-close').addEventListener('click', function () { panel.classList.remove('open'); });

    panel.querySelectorAll('.tiga-chip[data-role]').forEach(function (chip) {
      chip.addEventListener('click', function () { setRole(chip.getAttribute('data-role')); });
    });
    panel.querySelectorAll('.tiga-chip[data-access]').forEach(function (chip) {
      chip.addEventListener('click', function () { setAccess(chip.getAttribute('data-access')); });
    });

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !fab.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildWidget();
    apply();
  });
})();
