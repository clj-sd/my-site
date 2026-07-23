/**
 * 中经集团官网 - 交互脚本（美化版）
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== 导航栏滚动效果 ==========
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // ========== 汉堡菜单 ==========
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // 点击导航链接关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ========== 滚动显示动画 ==========
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 给未标记的元素自动添加 reveal
  document.querySelectorAll('.section-header, .card, .sub-card, .stat-item, .info-card')
    .forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        revealObserver.observe(el);
      }
    });

  // ========== 数字滚动动画 ==========
  const animateNumbers = () => {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out 缓动
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    });
  };

  // 数字进入视口时动画
  const numbersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        numbersObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stat-number[data-target]');
  if (statsSection) {
    numbersObserver.observe(statsSection);
  }

  // ========== Hero 粒子效果 ==========
  const heroParticles = document.querySelector('.hero-particles');
  if (heroParticles) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 8) + 's';
      particle.style.width = (2 + Math.random() * 5) + 'px';
      particle.style.height = particle.style.width;
      heroParticles.appendChild(particle);
    }
  }

  // ========== 平滑视差效果 ==========
  const parallaxElements = document.querySelectorAll('.parallax');

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const offset = (centerY - windowCenter) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }
});
