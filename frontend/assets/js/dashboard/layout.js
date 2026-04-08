document.addEventListener('DOMContentLoaded', () => {
  const shell = document.body;
  const rootPath = shell.dataset.root || '..';
  const pageId = shell.dataset.page || 'dashboard';

  const pages = [
    { id: 'dashboard', label: 'Dashboard', href: `${rootPath}/dashboard/index.html`, icon: 'fa-chart-pie' },
    { id: 'agenda', label: 'Agenda', href: `${rootPath}/dashboard/pages/agenda.html`, icon: 'fa-calendar-days' },
    { id: 'profissionais', label: 'Profissionais', href: `${rootPath}/dashboard/pages/profissionais.html`, icon: 'fa-user-tie' }
  ];

  const headerContainer = document.getElementById('header-container');
  const sidebarContainer = document.getElementById('sidebar-container');

  if (headerContainer) {
    headerContainer.innerHTML = `
      <header class="mobile-header">
        <button class="menu-toggle" id="menuToggle" aria-label="Abrir menu">
          <i class="fas fa-bars"></i>
        </button>
        <div class="mobile-brand">
          <img src="${rootPath}/assets/img/branding/saloon-logo.png" alt="Saloon Save" class="brand-logo">
        </div>
        <button class="theme-toggle mobile" type="button" data-theme-toggle>
          <i class="theme-toggle-icon fas fa-moon" data-theme-icon></i>
          <span class="theme-toggle-label" data-theme-label>Tema escuro</span>
        </button>
      </header>
    `;
  }

  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-top">
          <div class="sidebar-brand">
            <img src="${rootPath}/assets/img/branding/saloon-logo.png" alt="Saloon Save" class="brand-logo">
          </div>
          <button class="close-sidebar" id="closeSidebar" aria-label="Fechar menu">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <nav class="sidebar-nav" aria-label="Menu principal">
          <span class="sidebar-section-label">Painel</span>
          ${pages.map((page) => `
            <a href="${page.href}" class="${page.id === pageId ? 'active' : ''}">
              <i class="fas ${page.icon}"></i>
              <span>${page.label}</span>
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <strong>Saloon Save</strong>
          <p>Gestao de agendamentos, equipe e atendimento.</p>
          <button class="theme-toggle block" type="button" data-theme-toggle style="margin-top: 14px;">
            <i class="theme-toggle-icon fas fa-moon" data-theme-icon></i>
            <span class="theme-toggle-label" data-theme-label>Tema escuro</span>
          </button>
        </div>
      </aside>
    `;
  }

  if (window.ThemeController) {
    window.ThemeController.bindToggles();
  }

  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => sidebar.classList.add('open'));
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  document.querySelectorAll('.sidebar-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });
});
