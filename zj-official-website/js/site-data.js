/**
 * 官网前台数据加载器
 * 从 localStorage 读取后台数据，回退到默认值
 * 使用时在前台页面引入：<script src="../admin/data.js"></script><script src="js/site-data.js"></script>
 */
(function(global){
  'use strict';

  if(!global.WebData){
    console.warn('[site-data] WebData 未加载，请先引入 admin/data.js');
    return;
  }

  // 数据访问快捷方法
  var SiteData = {
    // 获取任意数据路径，带默认值
    get: function(path, defaultVal){
      var val = WebData.get(path);
      return (val !== undefined && val !== null && val !== '') ? val : defaultVal;
    },

    // 站点信息
    siteName: function(){ return this.get('site.name','中经集团'); },
    siteSubtitle: function(){ return this.get('site.subtitle','中正创新 · 经世致用'); },
    contactEmail: function(){ return this.get('site.contactEmail',''); },
    contactPhone: function(){ return this.get('site.contactPhone',''); },
    icp: function(){ return this.get('site.icp',''); },

    // 集团门户
    portalHeroTitle: function(){ return this.get('portal.heroTitle','中正创新 · 经世致用'); },
    portalHeroSubtitle: function(){ return this.get('portal.heroSubtitle',''); },
    subsidiaries: function(){ return this.get('portal.subsidiaries',[]); },

    // 原子首页
    atomHeroTitle: function(){ return this.get('atom.home.heroTitle','中经原子'); },
    atomHeroSubtitle: function(){ return this.get('atom.home.heroSubtitle',''); },
    atomHeroDesc: function(){ return this.get('atom.home.heroDesc',''); },
    atomAdvantages: function(){ return this.get('atom.home.advantages',[]); },
    atomStats: function(){ return this.get('atom.home.stats',[]); },

    // 原子关于
    atomAboutTeam: function(){ return this.get('atom.about.team',[]); },
    atomAboutMilestones: function(){ return this.get('atom.about.milestones',[]); },
    atomAboutIntro: function(){ return this.get('atom.about.intro',''); },

    // 原子业务
    atomBizSections: function(){ return this.get('atom.business.sections',[]); },

    // 原子治疗中心
    atomCenters: function(){ return this.get('atom.treatment.centers',[]); },

    // 原子招聘
    atomPositions: function(){ return this.get('atom.join.positions',[]); },
    atomCampusNotice: function(){ return this.get('atom.join.campusNotice',''); },

    // 原子新闻
    atomNewsItems: function(){ return this.get('atom.news.items',[]); },

    // 企管首页
    qgHeroTitle: function(){ return this.get('qg.home.heroTitle','中经企管'); },
    qgHeroSubtitle: function(){ return this.get('qg.home.heroSubtitle',''); },
    qgHeroDesc: function(){ return this.get('qg.home.heroDesc',''); },
    qgServices: function(){ return this.get('qg.home.services',[]); },
    qgStats: function(){ return this.get('qg.home.stats',[]); },

    // 企管简介
    qgProfileIntro: function(){ return this.get('qg.profile.intro',''); },
    qgProfileMilestones: function(){ return this.get('qg.profile.milestones',[]); },
    qgProfileCulture: function(){ return this.get('qg.profile.culture',[]); },

    // 企管服务
    qgServiceItems: function(){ return this.get('qg.service.items',[]); },

    // 企管合作
    qgCoopModes: function(){ return this.get('qg.cooperation.modes',[]); },

    // 企管动态
    qgCompanyNews: function(){ return this.get('qg.dynamic.companyNews',[]); },
    qgIndustryNews: function(){ return this.get('qg.dynamic.industryNews',[]); },

    // 企管联系
    qgContact: function(){ return this.get('qg.contact',{}); },

    // 全局
    footerAbout: function(){ return this.get('global.footerAbout',''); },
    footerLinks: function(){ return this.get('global.footerLinks',[]); }
  };

  global.SiteData = SiteData;
})(window);
