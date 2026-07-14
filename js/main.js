// Selector de rol / panel dinámico — reutilizable en cualquier página TIGA
document.addEventListener('DOMContentLoaded', () => {
  const switches = document.querySelectorAll('[data-role-switch]');
  switches.forEach(group => {
    const buttons = group.querySelectorAll('.role-btn');
    const panelWrap = document.querySelector(group.dataset.roleSwitch);
    if (!panelWrap) return;
    const panels = panelWrap.querySelectorAll('.role-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = panelWrap.querySelector(`#${btn.dataset.target}`);
        if (target) {
          target.classList.add('active');
          // reinicia la animación de entrada de las tarjetas
          target.querySelectorAll('.tool-card').forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = null;
          });
        }
      });
    });
  });
});
