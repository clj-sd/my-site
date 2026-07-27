/**
 * 中经集团官网 - Hero 轮播图脚本
 * 支持：自动播放、手动切换、触摸滑动、键盘导航、响应式
 */
(function () {
  'use strict';

  var SELECTOR = '.carousel';
  var carousel = document.querySelector(SELECTOR);
  if (!carousel) return;

  var track      = carousel.querySelector('.carousel-track');
  var slides     = carousel.querySelectorAll('.carousel-slide');
  var prevBtn    = carousel.querySelector('.carousel-arrow--prev');
  var nextBtn    = carousel.querySelector('.carousel-arrow--next');
  var dots       = carousel.querySelectorAll('.carousel-dot');
  var total      = slides.length;
  if (total < 2) {
    // 只有一张图时隐藏箭头和指示点
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dots.length) dots.forEach(function(d){ d.style.display = 'none'; });
    return;
  }

  var current    = 0;
  var autoplayTimer = null;
  var AUTOPLAY_INTERVAL = 5000;  // 5 秒自动切换
  var pausedByUser = false;       // 用户悬停/聚焦时暂停
  var touchStartX = 0;
  var touchEndX   = 0;

  // ── 切换逻辑 ──
  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    // 更新指示点
    dots.forEach(function(d, i){
      d.classList.toggle('active', i === current);
    });
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  // ── 自动播放 ──
  function startAutoplay() {
    stopAutoplay();
    if (pausedByUser) return;
    autoplayTimer = setInterval(goNext, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // ── 按钮绑定 ──
  if (prevBtn) {
    prevBtn.addEventListener('click', function(){
      goPrev();
      stopAutoplay();
      startAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function(){
      goNext();
      stopAutoplay();
      startAutoplay();
    });
  }

  // ── 指示点绑定 ──
  dots.forEach(function(dot, i){
    dot.addEventListener('click', function(){
      goTo(i);
      stopAutoplay();
      startAutoplay();
    });
  });

  // ── 键盘导航 ──
  document.addEventListener('keydown', function(e){
    // 仅在轮播图可见时响应
    var rect = carousel.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
      stopAutoplay();
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
      stopAutoplay();
      startAutoplay();
    }
  });

  // ── 触摸滑动 ──
  carousel.addEventListener('touchstart', function(e){
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', function(e){
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { goNext(); }
      else          { goPrev(); }
      stopAutoplay();
      startAutoplay();
    }
  }, { passive: true });

  // ── 鼠标悬停暂停 ──
  carousel.addEventListener('mouseenter', function(){
    pausedByUser = true;
    stopAutoplay();
  });
  carousel.addEventListener('mouseleave', function(){
    pausedByUser = false;
    startAutoplay();
  });

  // ── 焦点可见性：页面切到后台时暂停 ──
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) {
      stopAutoplay();
    } else {
      pausedByUser = false;
      startAutoplay();
    }
  });

  // ── 启动 ──
  goTo(0);
  startAutoplay();

})();
