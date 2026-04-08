(function () {
  const THEME_KEY = 'saloonsave_theme';
  const root = document.documentElement;

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function getPreferredTheme() {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getCurrentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function updateButtons(theme) {
    const isDark = theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const icon = button.querySelector('[data-theme-icon]');
      const label = button.querySelector('[data-theme-label]');

      if (icon) {
        icon.className = `theme-toggle-icon fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
      }

      if (label) {
        label.textContent = isDark ? 'Tema claro' : 'Tema escuro';
      }

      button.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
      button.setAttribute('title', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    updateButtons(theme);
  }

  function toggleTheme() {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {}
  }

  function bindToggles(scope = document) {
    scope.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      if (button.dataset.themeBound === 'true') {
        return;
      }

      button.dataset.themeBound = 'true';
      button.addEventListener('click', toggleTheme);
    });

    updateButtons(getCurrentTheme());
  }

  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    bindToggles();
  });

  window.ThemeController = {
    bindToggles,
    toggleTheme,
    applyTheme,
    getCurrentTheme
  };
})();
