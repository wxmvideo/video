// pages/mall/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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
    mainHeight: 600,
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
    // 导航色调
    mainColor:''
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
  //加载分类信息 初始化数据
  initPage: function () {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'mall',
      o: 'cates'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {

        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);

        this.data.cateAll = result.cates;
        this.data.mainColor = result.init.color_primary;
        this.data.reloadColor[1] = result.init.color_primary;
        for (var i = 0; i < this.data.cateAll.length; i++) {
          this.data.itemAll.push([]);
          this.data.cates.push(this.data.cateAll[i].name);
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
          reloadColor:this.data.reloadColor
        });

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
      k: 'mall',
      o: 'list',
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
  openGoods: function (e) {
    wx.navigateTo({
      url: '../mall/detail?id=' +  e.currentTarget.dataset.id
    });
  },
  backIndex: function() {
    wx.navigateBack({
      delta: 99999
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})