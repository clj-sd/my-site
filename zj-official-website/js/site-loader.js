/**
 * 官网数据加载器 - 将后台编辑数据动态渲染到前台页面
 * 页面引入 admin/data.js + 本脚本后，配置数据绑定即可
 */
(function(global){
  'use strict';

  // 确保 WebData 已加载
  if(!global.WebData){
    console.error('site-loader: WebData 未找到，请先引入 admin/data.js');
    return;
  }

  var D = global.WebData;

  /**
   * 批量填充文本：{ selector: 'data.path' }
   * 例: fillTexts({ '#heroTitle': 'atom.home.heroTitle', '.subtitle': 'site.subtitle' })
   */
  function fillTexts(map){
    Object.keys(map).forEach(function(sel){
      var el = document.querySelector(sel);
      if(el){
        var val = D.get(map[sel]);
        if(val !== undefined && val !== null) el.textContent = val;
      }
    });
  }

  /**
   * 批量填充链接：{ selector: 'data.path' }
   */
  function fillLinks(map){
    Object.keys(map).forEach(function(sel){
      var el = document.querySelector(sel);
      if(el){
        var val = D.get(map[sel]);
        if(val) el.href = val;
      }
    });
  }

  /**
   * 批量填充属性：{ selector: { attr: 'data.path', attr2: 'data.path' } }
   */
  function fillAttrs(map){
    Object.keys(map).forEach(function(sel){
      var el = document.querySelector(sel);
      if(!el) return;
      var pairs = map[sel];
      Object.keys(pairs).forEach(function(attr){
        var val = D.get(pairs[attr]);
        if(val !== undefined && val !== null) el.setAttribute(attr, val);
      });
    });
  }

  /**
   * 根据数据数组渲染列表
   * @param {string} containerSel 容器选择器
   * @param {string} dataPath     WebData 路径（返回数组）
   * @param {string} itemHTML     HTML 模板字符串，用 {{field}} 占位
   * @param {string} emptyHTML    空列表时显示的HTML（可选）
   */
  function renderList(containerSel, dataPath, itemHTML, emptyHTML){
    var container = typeof containerSel === 'string' ? document.querySelector(containerSel) : containerSel;
    if(!container) return;
    var items = D.get(dataPath) || [];
    if(items.length === 0 && emptyHTML){
      container.innerHTML = emptyHTML;
      return;
    }
    var html = '';
    items.forEach(function(item, idx){
      var h = itemHTML;
      // 支持 {{field}} 模板
      h = h.replace(/\{\{(\w+)\}\}/g, function(_, field){
        var v = item[field];
        if(v === undefined || v === null) return '';
        if(Array.isArray(v)) return v.join(', ');
        return String(v);
      });
      h = h.replace(/\{\{index\}\}/g, idx);
      html += h;
    });
    container.innerHTML = html;
  }

  /**
   * 逐个渲染列表项（回调方式，更灵活）
   * @param {string} containerSel
   * @param {string} dataPath
   * @param {function} renderFn  (item, index, items) => htmlString
   * @param {string} emptyHTML
   */
  function renderListFn(containerSel, dataPath, renderFn, emptyHTML){
    var container = typeof containerSel === 'string' ? document.querySelector(containerSel) : containerSel;
    if(!container) return;
    var items = D.get(dataPath) || [];
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

  /**
   * 获取数据值
   */
  function getData(path){
    return D.get(path);
  }

  // 暴露 API
  global.SiteLoader = {
    fillTexts: fillTexts,
    fillLinks: fillLinks,
    fillAttrs: fillAttrs,
    renderList: renderList,
    renderListFn: renderListFn,
    get: getData,
    WebData: D
  };

})(window);
