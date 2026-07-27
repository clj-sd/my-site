/**
 * 官网基础交互脚本 — 全响应式支持
 * 自动处理：移动端汉堡菜单、header 滚动效果、返回顶部
 * 引入此脚本后，页面无需分别处理这些功能
 */
(function(){
  'use strict';

  // ── 检测并注入汉堡菜单 ──
  function initMobileNav(){
    var header = document.querySelector('.header, .site-header');
    if(!header) return;

    var headerInner = header.querySelector('.header-inner, .container');
    if(!headerInner) {
      // .site-header 使用 .container，给 header 包上
      headerInner = header;
    }

    // 检查是否已有 hamburger
    var existingHamburger = header.querySelector('.hamburger');
    var existingMobileNav = document.querySelector('.mobile-nav');

    // 如果没有 hamburger，自动注入
    if(!existingHamburger){
      var hamburger = document.createElement('button');
      hamburger.className = 'hamburger';
      hamburger.setAttribute('aria-label', '菜单');
      hamburger.innerHTML = '<span></span><span></span><span></span>';

      // 插入到 header-inner 中，在 nav 之后
      var navEl = header.querySelector('.nav');
      if(navEl){
        navEl.parentNode.insertBefore(hamburger, navEl.nextSibling);
      } else {
        headerInner.appendChild(hamburger);
      }
      existingHamburger = hamburger;
    }

    // 如果没有 mobile-nav，自动生成
    if(!existingMobileNav){
      var mobileNav = document.createElement('div');
      mobileNav.className = 'mobile-nav';
      mobileNav.setAttribute('role', 'navigation');
      mobileNav.setAttribute('aria-label', '移动端导航');

      // 从 .nav ul 或 .nav-links 复制链接
      var links = header.querySelectorAll('.nav a, .nav-links a');
      links.forEach(function(a){
        var clone = a.cloneNode(true);
        clone.classList.remove('active'); // 避免移动端也高亮
        if(window.location.href.indexOf(a.getAttribute('href')) !== -1
           || (a.getAttribute('href') === 'index.html' && window.location.pathname.endsWith('/'))
           || window.location.pathname.endsWith(a.getAttribute('href'))){
          clone.classList.add('active');
        }
        mobileNav.appendChild(clone);
      });

      document.body.appendChild(mobileNav);
      existingMobileNav = mobileNav;
    }

    // 绑定汉堡点击事件
    var isOpen = false;
    existingHamburger.onclick = function(){
      isOpen = !isOpen;
      existingHamburger.classList.toggle('active', isOpen);
      existingMobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // 点击移动端链接后关闭菜单
    existingMobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        isOpen = false;
        existingHamburger.classList.remove('active');
        existingMobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Header 滚动效果 ──
  function initHeaderScroll(){
    var header = document.querySelector('.site-header, .header');
    if(!header) return;

    var lastScrollY = 0;
    var ticking = false;

    function update(){
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      if(scrollY > 60){
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function(){
      if(!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // 初始检查
    update();
  }

  // ── 返回顶部按钮 ──
  function initBackToTop(){
    var existing = document.querySelector('.back-to-top');
    var btn = existing;

    if(!btn){
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', '返回顶部');
      btn.innerHTML = '↑';
      document.body.appendChild(btn);
    }

    var ticking = false;

    function update(){
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if(scrollY > 400){
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function(){
      if(!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    update();
  }

  // ── Scroll Reveal 动画 ──
  function initScrollReveal(){
    var reveals = document.querySelectorAll('.reveal');
    if(!reveals.length) return;

    var ticking = false;

    function update(){
      var windowHeight = window.innerHeight;
      reveals.forEach(function(el){
        var top = el.getBoundingClientRect().top;
        if(top < windowHeight - 100){
          el.classList.add('visible');
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function(){
      if(!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // 初始显示在视口内的元素
    update();
  }

  // ── 防止 iOS 橡皮筋溢出 ──
  function preventOverscroll(){
    document.addEventListener('touchmove', function(e){
      if(document.body.style.overflow === 'hidden'){
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ── 窗口尺寸变化时关闭移动菜单 ──
  function initResizeHandler(){
    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        var hamburger = document.querySelector('.hamburger.active');
        var mobileNav = document.querySelector('.mobile-nav.open');
        if(window.innerWidth > 768 && hamburger && mobileNav){
          hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      }, 150);
    });
  }

  // ── 触控设备 hover 优化 ──
  function initTouchHoverFix(){
    var touchDetected = false;
    var touchHandler = function(){
      touchDetected = true;
      document.removeEventListener('touchstart', touchHandler);
    };
    document.addEventListener('touchstart', touchHandler, { once: true });
  }

  // ── 启动 ──
  function init(){
    initMobileNav();
    initHeaderScroll();
    initBackToTop();
    initScrollReveal();
    initResizeHandler();
    preventOverscroll();
    initTouchHoverFix();
  }

  // DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
