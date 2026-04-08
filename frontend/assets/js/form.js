document.addEventListener('DOMContentLoaded', () => {
  const dashboardPath = './dashboard/index.html';
  const tabs = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.form');
  const tabsContainer = document.getElementById('main-tabs');

  function showForm(id) {
    forms.forEach(f => f.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    // Esconde abas se não for login/cadastro
    tabsContainer.style.display = (id === 'login-form' || id === 'signup-form') ? 'flex' : 'none';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showForm(`${tab.dataset.tab}-form`);
    });
  });

  // Esqueci senha
  document.getElementById('open-forgot').addEventListener('click', (e) => {
    e.preventDefault();
    showForm('forgot-form');
  });

  // Voltar
  document.querySelectorAll('.back-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      tabs[0].click();
    });
  });

  // Cadastro -> Verificação
  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showForm('verify-form');
  });

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('saloonsave_mock_auth', 'true');
    window.location.href = dashboardPath;
  });

  document.getElementById('verify-form').addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('saloonsave_mock_auth', 'true');
    window.location.href = dashboardPath;
  });

  // Máscara Telefone
  document.getElementById('phone').addEventListener('input', (e) => {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  });

  // Olhinho Senha
  document.querySelectorAll('.toggle-pass').forEach(icon => {
    icon.addEventListener('click', function() {
      const input = document.getElementById(this.dataset.target);
      input.type = input.type === 'password' ? 'text' : 'password';
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  });
});
