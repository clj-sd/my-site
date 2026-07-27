/**
 * 官网数据加载器（前端渲染工具）
 * 配合 data-loader.js 使用，从 data.json 读取数据后渲染到页面
 */
(function(global){
  'use strict';

  function escHtml(str){
    if(!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function fillTexts(map){
    Object.keys(map).forEach(function(sel){
      var el = document.querySelector(sel);
      if(el){
        var val = WebData.get(map[sel]);
        if(val !== undefined && val !== null) el.textContent = val;
      }
    });
  }

  function fillLinks(map){
    Object.keys(map).forEach(function(sel){
      var el = document.querySelector(sel);
      if(el){
        var val = WebData.get(map[sel]);
        if(val) el.href = val;
      }
    });
  }

  function fillAttrs(map){
    Object.keys(map).forEach(function(sel){
      var el = document.querySelector(sel);
      if(!el) return;
      var pairs = map[sel];
      Object.keys(pairs).forEach(function(attr){
        var val = WebData.get(pairs[attr]);
        if(val !== undefined && val !== null) el.setAttribute(attr, val);
      });
    });
  }

  function renderList(containerSel, dataPath, itemHTML, emptyHTML){
    var container = typeof containerSel === 'string' ? document.querySelector(containerSel) : containerSel;
    if(!container) return;
    var items = WebData.get(dataPath) || [];
    if(items.length === 0 && emptyHTML){
      container.innerHTML = emptyHTML;
      return;
    }
    var html = '';
    items.forEach(function(item, idx){
      var h = itemHTML;
      h = h.replace(/\{\{(\w+)\}\}/g, function(_, field){
        var v = item[field];
        if(v === undefined || v === null) return '';
        if(Array.isArray(v)) return v.join(', ');
        return escHtml(String(v));
      });
      h = h.replace(/\{\{index\}\}/g, idx);
      html += h;
    });
    container.innerHTML = html;
  }

  function renderListFn(containerSel, dataPath, renderFn, emptyHTML){
    var container = typeof containerSel === 'string' ? document.querySelector(containerSel) : containerSel;
    if(!container) return;
    var items = WebData.get(dataPath) || [];
    if(items.length === 0 && emptyHTML){
      container.innerHTML = emptyHTML;
      return;
    }
    var html = '';
    items.forEach(function(item, idx){
      html += renderFn(item, idx, items);
    });
    container.innerHTML = html;
  }

  function getData(path){
    return WebData.get(path);
  }

  global.SiteLoader = {
    fillTexts: fillTexts,
    fillLinks: fillLinks,
    fillAttrs: fillAttrs,
    renderList: renderList,
    renderListFn: renderListFn,
    get: getData,
    WebData: WebData
  };

})(window);