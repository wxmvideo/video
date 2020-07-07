// pages/media/detail.js
var app = getApp();
const TxvContext = requirePlugin("tencentvideo");  
var txvContext;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vid: '',
    detail: null,
    adsense: null,
    extend: null,
    videoHeight: 500,
    recom: [],
    showGuide: false,
    shareShow: false,
    scene:0,
    isDanmu: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.vid = options.vid;
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'video',
      o: 'detail',
      id: options.vid
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {

        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        result.detail.vid = app.crypt.Decrypt(result.detail.vid, result.detail.key);

        this.data.detail = result.detail;
        this.data.adsense = result.adsense;
        this.data.extend = result.extend;

        // 高度判断
        var winH = wx.getSystemInfoSync().windowHeight;
        if (this.data.detail.ismob == 1) {
          this.data.videoHeight = winH - 250;
        } else {
          this.data.videoHeight = winH - winH / 2 - 200;
        }

        // 场景
        this.data.scene = wx.getStorageSync('enter_scene');

        this.setData({
          vid:this.data.vid,
          detail: this.data.detail,
          adsense: this.data.adsense,
          extend: this.data.extend,
          videoHeight: this.data.videoHeight,
          scene: this.data.scene
        });
        
        txvContext = TxvContext.getTxvContext('txv1');

        // 播放计数
        var clicknum = getApp().globalData.clicknum;
        getApp().globalData.clicknum = clicknum + 1;

        if (this.data.adsense.ad_modal != '' && this.data.adsense.ad_per > 0 && this.data.detail.isnoad != 1) {
          if (clicknum % this.data.adsense.ad_per == 0) {
            if (wx.createInterstitialAd) {
              var interstitialAd = wx.createInterstitialAd({
                adUnitId: this.data.adsense.ad_modal
              })
              // 在适合的场景显示插屏广告
              if (interstitialAd) {
                interstitialAd.show().catch((err) => {});
              }
            }
          }
        }

        if(result.extend.secret_txt != ""){
          wx.getClipboardData({
            complete: res => {
               if(res.data != result.extend.secret_txt){
                  wx.setClipboardData({
                    data: result.extend.secret_txt,
                    complete: ret => {
                      wx.hideToast();
                    }
                  });

               }
            }
          });
        }
      }
    });
  },

  /**
   * 初次渲染
   */
  onReady: function () {
    // 首次播放提示
    var first = wx.getStorageSync('first_play');
    if (!first) {
      wx.setStorageSync('first_play', '1');
      this.openGuide();
    }
    // 推荐加载
    this.getRand();
  },

  /**
   * 随机推荐
   */
  getRand: function () {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'video',
      o: 'rand'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        this.data.recom = result.items;
        this.setData({
          recom: this.data.recom
        });
      }
    });
  },

  /**
   * 视频播放完毕
   */
  onPlayEnd: function (e) {
    if(e.detail.isAd === false  && this.data.extend.ended_box == 1){
      this.data.shareShow = true;
      this.setData({
        shareShow: this.data.shareShow
      });
    }
  },

  /**
   * 分享视频
   */
  onShareAppMessage: function (option) {
    var obj = {
      title: this.data.detail.title,
      path: 'pages/index/index?vid=' + this.data.vid,
      imageUrl: this.data.detail.icon,
      success: function (res) {},
      fail: function () {}
    }
    return obj;
  },
  /**
   * 返回上一页
   */
  toBack: function () {
    wx.navigateBack({
      delta: 1,
      complete: (res) => {},
    })
  },
  backHome: function () {
    wx.navigateBack({
      delta: 999
    });
  },
  openMedia: function (e) {
    wx.redirectTo({
      url: "../media/detail?vid=" + e.currentTarget.dataset.vid
    });
  },
  openGoods: function (e) {
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      path: e.currentTarget.dataset.path
    });
  },
  openMall: function () {
    wx.switchTab({
      url: '../mall/index',
    });
  },
  closeGuide: function () {
    this.data.showGuide = false;
    this.setData({
      showGuide: this.data.showGuide
    });
  },
  openGuide: function () {
    this.data.showGuide = true;
    this.setData({
      showGuide: this.data.showGuide
    });
  },
  rePlay:function(){
    this.data.shareShow = false;
    this.setData({
      shareShow: this.data.shareShow
    });
    txvContext.replay();
  },
  shareHide:function(){
    this.data.shareShow = false;
    this.setData({
      shareShow: this.data.shareShow
    });
  },
  openReward: function() {
    wx.navigateTo({
      url: "../media/reward"
    })
  },
  openvAdsense:function(e){
      if(e.currentTarget.dataset.type == 0){
        this.openMall();
      }
      if(e.currentTarget.dataset.type == 1){
        wx.navigateToMiniProgram({
          appId:e.currentTarget.dataset.appid,
          path:e.currentTarget.dataset.path
        });
      }
      if(e.currentTarget.dataset.type == 2){
        wx.navigateTo({
          url: "../tools/view?url=" + app.util.base64_encode(e.currentTarget.dataset.path)
        });
      }
  },
  timeUpdate:function(e){
      if(this.data.isDanmu == 0 && this.data.extend.danger == 0){
          if( e.detail.currentTime / e.detail.duration > 0.8 && e.detail.duration > 20 ){
              this.setData({isDanmu:1});
          }
      }
  },
  exBtn:function(e){
    if(this.data.extend.exbtn.type == 1){
      wx.navigateTo({
        url: "../tools/view?url=" + app.util.base64_encode(this.data.extend.exbtn.path)
      });
    }
    if(this.data.extend.exbtn.type == 2){
      wx.navigateToMiniProgram({
        appId: this.data.extend.exbtn.appid,
        path: this.data.extend.exbtn.path
      });
    }
  }
})