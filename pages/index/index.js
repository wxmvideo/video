var app = getApp();
Page({
  data: {
    // 重载背景
    reloadBgColor: [
      '#ffffff', '#ffffff', '#ffffff'
    ],
    // 重载字色
    reloadColor: [
      '#888888', '#FF6666', '#33CC99'
    ],
    currentIndex: 0,
    // 主区高度
    mainHeight: 1500,
    // 分类数据
    cateAll: [],
    // 分类存储
    cates: [],
    // 视频数组
    itemAll: [],
    // 卡片分页
    pages: [],
    // 加载状态
    loadingTypes: [],
    // 滚动存储
    scrollTops: [],
    // 主色调
    mainColor: '',
    // 加载参数
    init: {},
    // 分享参数
    share: {},
    // 浮动工具
    toolBar: true,
    // 工具状态
    menuShow: false
  },
  onLoad: function (options) {
    wx.aldstat.sendEvent('获取用户昵称', {
      "用户昵称": "DemoChen"
    })
    var vid = options.vid;
    if (vid != '' && vid != null && vid != undefined) {
      var uniacid = options.uniacid;
      if (uniacid != '' && uniacid != null && uniacid != undefined) {
        if (uniacid > 0) {
          this.toMedia(vid, uniacid);
        }
      } else {
        this.toMedia(vid);
      }
    }
    var gid = options.gid;
    if (gid != '' && gid != null && gid != undefined) {
      this.toGoods(gid);
    }
    var op = options.op;
    if (op != '' && op != null && op != undefined) {
      if (op == 'weather') {
        this.openWeather();
      }
      if (op == 'calander') {
        this.openCalander();
      }
      if (op == 'eight') {
        this.openEight();
      }
    }
  },
  onReady: function () {
    setTimeout(() => {
      wx.createSelectorQuery().select('#gBody').fields({
        size: true
      }, (res) => {
        this.setData({
          mainHeight: res.height
        });
      }).exec();
    }, 1000);
    //加载分类信息 初始化数据
    this.initPage();
  },
  navChange: function (e) {
    this.setData({
      currentIndex: e.detail
    });
  },
  swiperChange: function (e) {
    var index = e.detail.current;
    this.setData({
      currentIndex: index
    });
    if (this.data.loadingTypes[this.data.currentIndex] != 2 || this.data.loadingTypes[this.ata.currentIndex] != 4) {
      this.loadData();
    }
  },
  //加载分类信息 初始化数据
  initPage: function () {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'init'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        this.data.cateAll = result.cates;
        this.data.init = result.init;
        this.data.mainColor = result.init.color_primary;
        this.data.reloadColor[1] = result.init.color_primary;
        this.data.share = result.share;
        for (var i = 0; i < this.data.cateAll.length; i++) {
          this.data.itemAll.push([]);
          this.data.cates.push(this.data.cateAll[i].title);
          this.data.pages.push(1);
          this.data.loadingTypes.push(3);
          this.data.scrollTops.push(0);
        }
        this.setData({
          itemAll: this.data.itemAll,
          cates: this.data.cates,
          pages: this.data.pages,
          loadingTypes: this.data.loadingTypes,
          scrollTops: this.data.scrollTops,
          mainColor: this.data.mainColor,
          reloadColor: this.data.reloadColor,
          init: this.data.init,
          share: this.data.share
        });
        console.log(this.data.init);
        this.loadData();
      }
    });
  },
  // 加载数据
  loadData: function (isReload) {
    if (!isReload) {
      this.data.loadingTypes.splice(this.data.currentIndex, 1, 1);
      this.setData({
        loadingTypes: this.data.loadingTypes
      });
    }
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'video',
      'o': 'list',
      cateid: this.data.cateAll[this.data.currentIndex].id,
      page: this.data.pages[this.data.currentIndex]
    });
    wx.request({
      url: url,
      method: 'GET',
      data: {},
      success: res => {
        if (res.data.status == 1) {
          let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
          let result = JSON.parse(json);
          // 第一页
          if (this.data.pages[this.data.currentIndex] == 1) {
            this.data.itemAll.splice(this.data.currentIndex, 1, result.items);
            this.setData({
              itemAll: this.data.itemAll
            });
          } else {
            this.data.itemAll[this.data.currentIndex] = this.data.itemAll[this.data.currentIndex].concat(result.items);
            this.setData({
              itemAll: this.data.itemAll
            });
          }
          // 页码增加
          this.data.pages[this.data.currentIndex]++;
          this.setData({
            pages: this.data.pages
          });
          setTimeout(() => {
            this.data.loadingTypes.splice(this.data.currentIndex, 1, 3);
            this.setData({
              loadingTypes: this.data.loadingTypes
            });
          }, 300)
        } else if (res.data.status == -2) {
          console.log('empty');
          this.data.itemAll[this.data.currentIndex] = 'empty';
          this.data.loadingTypes.splice(this.data.currentIndex, 1, 4);
          this.setData({
            itemAll: this.data.itemAll,
            loadingTypes: this.data.loadingTypes
          });
        } else if (res.data.status == -1) {
          console.log('nomore');
          this.data.loadingTypes.splice(this.data.currentIndex, 1, 2);
          this.setData({
            loadingTypes: this.data.loadingTypes
          });
        }
      },
      complete: () => {
        if (isReload) {
          setTimeout(() => {
            this.selectComponent("#graceReload" + this.data.currentIndex).endReload();
          }, 300)
        }
      }
    });
  },
  // 加载更多
  scrollend: function (e) {
    if (this.data.loadingTypes[this.data.currentIndex] == 2 || this.data.loadingTypes[this.data.currentIndex] == 4) {
      return false;
    }
    this.loadData();
  },
  scroll: function (e) {
    this.data.scrollTops[this.data.currentIndex] = e.detail.scrollTop;
    this.setData({
      scrollTops: this.data.scrollTops
    });
  },
  touchstart: function (e) {
    var touchObj = {
      scrollTop: this.data.scrollTops[this.data.currentIndex],
      moveY: e.changedTouches[0].pageY
    };
    this.selectComponent("#graceReload" + this.data.currentIndex).touchstart(touchObj);
  },
  touchmove: function (e) {
    var touchObj = {
      scrollTop: this.data.scrollTops[this.data.currentIndex],
      moveY: e.changedTouches[0].pageY
    };
    this.selectComponent("#graceReload" + this.data.currentIndex).touchmove(touchObj);
  },
  touchend: function (e) {
    var touchObj = {
      scrollTop: this.data.scrollTops[this.data.currentIndex],
      moveY: e.changedTouches[0].pageY
    };
    this.selectComponent("#graceReload" + this.data.currentIndex).touchend(touchObj);
  },
  // 下拉刷新
  reload: function () {
    this.data.pages[this.data.currentIndex] = 1;
    this.data.loadingTypes.splice(this.data.currentIndex, 1, 3);
    this.setData({
      pages: this.data.pages,
      loadingTypes: this.data.loadingTypes
    });
    this.loadData(1);
  },
  openMedia: function (e) {
    var uniacid = e.currentTarget.dataset.uniacid;
    if (uniacid != 0) {
      var appid = e.currentTarget.dataset.appid;
      wx.showModal({
        title: '提示',
        content: '即将进入高清页面进行播放',
        cancelColor: 'cancelColor',
        success: function (res) {
          if (res.confirm) {
            wx.navigateToMiniProgram({
              appId: appid,
              path: 'pages/index/index?vid=' + e.currentTarget.dataset.vid + '&uniacid=' + uniacid,
            });
          }
        }
      });
    } else {
      let type = e.currentTarget.dataset.type;
      if(type == 'link'){
        wx.navigateTo({
          url: '../tools/view?url=' + app.util.base64_encode(e.currentTarget.dataset.path)
        });
        return true;
      }else if(type == 'wxapp'){
        wx.navigateToMiniProgram({
          appId: e.currentTarget.dataset.appid,
          path:e.currentTarget.dataset.path
        });
        return true;
      }else{
        wx.navigateTo({
          url: "../media/detail?vid=" + e.currentTarget.dataset.vid
        });
      }
    }
  },
  openGoods: function (e) {
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      path: e.currentTarget.dataset.path,
      success(res) {
        // 打开成功
      }
    });
  },
  // 到达视频
  toMedia: function (vid, uniacid = 0) {
    wx.navigateTo({
      url: '../media/detail?vid=' + vid + '&uniacid=' + uniacid
    });
  },
  // 打开商品
  toGoods: function (gid) {
    wx.navigateTo({
      url: '../mall/detail?id=' + gid
    });
  },
  // 分享视频
  onShareAppMessage: function (option) {
    var obj;
    if (option.from == 'menu') {
      obj = {
        title: this.data.share.title,
        path: 'pages/index/index',
        imageUrl: this.data.share.image
      }
    } else {
      if (option.target.dataset.type == 'video') {
        obj = {
          title: option.target.dataset.title,
          path: 'pages/index/index?vid=' + option.target.dataset.id,
          imageUrl: option.target.dataset.thumb
        }
      } else if (option.target.dataset.type == 'goods') {
        obj = {
          title: option.target.dataset.title,
          path: 'pages/index/index?gid=' + option.target.dataset.id,
          imageUrl: option.target.dataset.thumb
        }
      }
    }
    return obj;
  },
  showmenu: function () {
    if (this.data.menuShow == false) {
      this.data.menuShow = true;
    } else {
      this.data.menuShow = false;
    }
    this.setData({
      menuShow: this.data.menuShow
    });
  },
  menuHide: function () {
    this.data.menuShow = false;
    this.setData({
      menuShow: this.data.menuShow
    });
  },
  // 打开商城
  openMall: function () {
    wx.navigateTo({
      url: "../mall/index"
    });
  },
  // 打开天气
  openWeather: function () {
    wx.navigateTo({
      url: "../tools/weather"
    });
  },
  // 打开日历
  openCalander: function () {
    wx.navigateTo({
      url: "../tools/calander"
    });
  },
  // 打开八字
  openEight:function(){
    wx.navigateTo({
      url: "../tools/eight"
    });
  },
  // 打开导航
  openNav: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type) {
      if (type == 1) {
        wx.navigateTo({
          url: "../tools/view?url=" + app.util.base64_encode(e.currentTarget.dataset.path)
        });
      } else {
        wx.navigateToMiniProgram({
          appId: e.currentTarget.dataset.appid,
          path: e.currentTarget.dataset.path
        });
      }
    }
  }
})