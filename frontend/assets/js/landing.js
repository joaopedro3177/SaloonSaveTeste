// ==================== landing.js ====================

document.addEventListener('DOMContentLoaded', () => {

  // Smooth Scroll para os links da navbar e botões
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Animação de fade-in ao rolar a página (Scroll Reveal simples)
  const sections = document.querySelectorAll('.section, .feature-card, .testimonial-card, .step');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.transition = 'all 0.6s ease';
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    observer.observe(section);
  });

  // Botão flutuante "Voltar ao topo" (opcional, mas fica bonito)
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
    background: #7C3AED; color: white; border: none; border-radius: 50%;
    font-size: 1.5rem; cursor: pointer; box-shadow: 0 10px 20px rgba(124,58,237,0.3);
    display: none; z-index: 1000;
  `;
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  console.log('%c🚀 Landing Page Saloon Save carregada com sucesso!', 'color:#7C3AED; font-weight:bold');
});