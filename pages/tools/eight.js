// pages/tools/eight.js
var app = getApp();
let videoAd = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hours:[
      '00:00-00:59子',
      '01:00-01:59丑',
      '02:00-02:59丑',
      '03:00-03:59寅',
      '04:00-04:59寅',
      '05:00-05:59卯',
      '06:00-06:59卯',
      '07:00-07:59辰',
      '08:00-08:59辰',
      '09:00-09:59巳',
      '10:00-10:59巳',
      '11:00-11:59午',
      '12:00-12:59午',
      '13:00-13:59未',
      '14:00-14:59未',
      '15:00-15:59申',
      '16:00-16:59申',
      '17:00-17:59酉',
      '18:00-18:59酉',
      '19:00-19:59戌',
      '20:00-20:59戌',
      '21:00-21:59亥',
      '22:00-22:59亥',
      '23:00-23:59子'
    ],
    hour: 0,
    date: '2020-01-01',
    gender:0,
    name:'',
    formShow:true,
    detail:null,
    share:{}
  },

  /**
   * 提交表单
   */
  formSubmit: function (e) {
    var data =  e.detail.value;
    if(data.username == ''){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      });
      return false;
    }
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'eight'
    });
    wx.showLoading({
      title: '正在计算',
    });
    wx.request({
      url: url,
      method: 'GET',
      data: data,
      success: res => {
        wx.hideLoading();
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        this.data.detail = result.detail;
        this.setData({detail:this.data.detail});

        // 激励视频
        let videoAd = null
        if (wx.createRewardedVideoAd) {
          videoAd = wx.createRewardedVideoAd({
            adUnitId: result.adsense
          });
        }
        if (videoAd) {
          videoAd.show().catch(() => {
            videoAd.load()
              .then(() => videoAd.show());
          });
        }
      }
    });
  },
  bindDateChange:function(e){
      console.log(e);
      this.data.date = e.detail.value;
      this.setData({date:this.data.date});
  },
  bindHourChange:function(e){
    this.data.hour = e.detail.value;
    this.setData({hour:this.data.hour});
  },
  onReady:function(){
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'eight',
      o: 'init'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
          this.data.share = result.share;
          this.setData({share:this.data.share});
      }
    });
  },
  /**
   * 分享功能
   */
  onShareAppMessage: function () {
    var obj = {
      title: this.data.share.title,
      path: 'pages/index/index?op=eight',
      imageUrl: this.data.share.thumb,
    }
    return obj;
  },
  backIndex: function() {
    wx.navigateBack({
      delta: 99999
    });
  }
})