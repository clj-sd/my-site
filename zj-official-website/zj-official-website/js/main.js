/* ============================================
   中经集团官网 - 公共交互脚本
   ============================================ */

(function () {
  'use strict';

  // ========== 1. 头部滚动阴影 ==========
  const header = document.querySelector('.site-header') || document.querySelector('.header');
  let lastScrollY = 0;

  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 10);
    }
    // 返回顶部按钮
    const btn = document.querySelector('.back-to-top');
    if (btn) {
      btn.classList.toggle('visible', y > 400);
    }
    lastScrollY = y;
  }

  // ========== 2. 移动端汉堡菜单 ==========
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav) {
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      }
    });
  }

  // ========== 3. 高亮当前导航链接 ==========
  function highlightActiveNav() {
    const currentPath = location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a, .nav-links a, .mobile-nav a').forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ========== 4. 返回顶部 ==========
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== 5. 滚动渐显动画 (IntersectionObserver) ==========
  function setupReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  // ========== Init ==========
  window.addEventListener('scroll', onScroll, { passive: true });
  highlightActiveNav();
  setupReveal();
  onScroll(); // 初始调用一次

})();
