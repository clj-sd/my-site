/**
 * 官网数据加载器 v2 — 从 data.json 文件读取数据
 * 替代 admin/data.js，前台和后台共用
 * 使用方式：<script src="路径/js/data-loader.js" data-root="../"></script>
 * data-root 指向 data.json 所在的目录（相对于当前页面）
 */
(function(global){
  'use strict';

  // 获取当前 script 标签上的 data-root 属性
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var ROOT = currentScript.getAttribute('data-root') || '';
  var DATA_URL = ROOT + 'data.json';

  var DB = null;
  var LOADED = false;
  var LISTENERS = [];

  function onReady(fn){
    if(LOADED && DB){ fn(DB); return; }
    LISTENERS.push(fn);
  }

  function notifyAll(){
    LISTENERS.forEach(function(fn){ fn(DB); });
    LISTENERS = [];
  }

  function get(path){
    if(!DB) return undefined;
    if(!path) return DB;
    var parts = path.split('.');
    var cur = DB;
    for(var i = 0; i < parts.length; i++){
      if(cur && typeof cur === 'object'){ cur = cur[parts[i]]; }
      else { return undefined; }
    }
    return cur;
  }

  function set(path, value){
    if(!DB) return;
    var parts = path.split('.');
    var cur = DB;
    for(var i = 0; i < parts.length - 1; i++){
      if(!cur[parts[i]] || typeof cur[parts[i]] !== 'object'){ cur[parts[i]] = {}; }
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function save(){
    if(!DB) return;
    DB.lastModified = new Date().toISOString();
    try { localStorage.setItem('zj_website_data', JSON.stringify(DB)); } catch(e){}
  }

  function reset(){
    return fetch(DATA_URL, { cache: 'reload' })
      .then(function(r){ return r.json(); })
      .then(function(data){
        DB = data;
        save();
        return true;
      });
  }

  function exportData(){
    return JSON.stringify(DB, null, 2);
  }

  function importData(jsonStr){
    try {
      var data = JSON.parse(jsonStr);
      if(!data.version || !data.site || !data.portal){ throw new Error('数据格式不正确'); }
      DB = data;
      save();
      return true;
    } catch(e){ return false; }
  }

  function getDefault(path){
    return get(path);
  }

  // 初始化
  function init(){
    fetch(DATA_URL, { cache: 'no-cache' })
      .then(function(r){
        if(!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data){
        DB = data;
        LOADED = true;
        try { localStorage.setItem('zj_website_data', JSON.stringify(DB)); } catch(e){}
        notifyAll();
      })
      .catch(function(err){
        console.warn('data-loader: 无法加载 ' + DATA_URL + '，尝试 localStorage 缓存', err.message);
        var cached = localStorage.getItem('zj_website_data');
        if(cached){
          try {
            DB = JSON.parse(cached);
            LOADED = true;
            notifyAll();
            return;
          } catch(e){}
        }
        console.error('data-loader: 无可用数据源');
        LOADED = true;
        DB = {};
        notifyAll();
      });
  }

  global.WebData = {
    get: get, set: set, save: save, reset: reset,
    exportData: exportData, importData: importData,
    getDefault: getDefault, getAll: function(){ return DB; },
    onReady: onReady, isReady: function(){ return LOADED && !!DB; }
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);