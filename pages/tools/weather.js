// pages/tool/weather.js
var app = getApp();
var WechatSI = requirePlugin("WechatSI");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: null,
    modalText: '',
    modalTitle: '',
    modalShow: false,
    mainClass: 'C1',
    dialogList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'weather'
    });
    var that = this;
    wx.getLocation({
      altitude: 'altitude',
      success:function(ret){

        wx.request({
          url: url,
          method: 'GET',
          data:{lat:ret.latitude,lon:ret.longitude},
          success: res => {
            let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
            let result = JSON.parse(json);
            console.log(result);
            var weather = result.weather.data;
            that.data.weather  = weather;
            var m = {
              "00": "C2",
              "01": "C9",
              "02": "C1",
              "03": "C3",
              "04": "C3",
              "05": "C3",
              "06": "C3",
              "07": "C3",
              "08": "C3",
              "09": "C3",
              10: "C3",
              11: "C3",
              12: "C3",
              13: "C4",
              14: "C4",
              15: "C4",
              16: "C4",
              17: "C4",
              18: "C5",
              19: "C3",
              20: "C7",
              21: "C3",
              22: "C3",
              23: "C3",
              24: "C3",
              25: "C3",
              26: "C4",
              27: "C4",
              28: "C4",
              29: "C7",
              30: "C7",
              31: "C7",
              53: "C6",
              99: "C8",
              32: "C5",
              49: "C5",
              54: "C6",
              55: "C6",
              56: "C6",
              57: "C5",
              58: "C5",
              301: "C3",
              302: "C4"
            };
            var d = m[weather.observe.weather_code];
            if (weather.air.aqi > 200 && d !== 'C7') {
              d = 'C6';
            }
            that.data.mainClass = d;
            that.setData({
              weather:that.data.weather,
              mainClass:that.data.mainClass
            });
            that.playVoice();

            if(result.adsense != ''){
              if (wx.createInterstitialAd) {
                var interstitialAd = wx.createInterstitialAd({
                  adUnitId: result.adsense
                })
                // 在适合的场景显示插屏广告
                if (interstitialAd) {
                  interstitialAd.show().catch((err) => {});
                }
              }
            }
            
          }
        }); 
      }
    });
  },
  showModal: function(e) {
    let idx = e.currentTarget.dataset.idx;
    if(idx != undefined){
      let modal = this.data.weather.index[idx];
      this.data.modalText = modal.detail;
      this.data.modalTitle = modal.name + modal.info;
      this.data.modalShow = true;
      this.setData({
        modalText:this.data.modalText,
        modalTitle:this.data.modalTitle,
        modalShow:this.data.modalShow
      });
    }
  },
  modalHide: function() {
    this.data.modalShow = false;
    this.setData({
      modalShow:this.data.modalShow
    });
  },
  playVoice:function(){
    WechatSI.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: this.data.weather.current.report,
      success: function(res) {
        var bgAudioMannager = wx.getBackgroundAudioManager();
        bgAudioMannager.title = '天气预报';
        bgAudioMannager.singer = '暂无';
        bgAudioMannager.coverImgUrl = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg';
        bgAudioMannager.src = res.filename;
        bgAudioMannager.play();
      }
    });
  },
  goBack:function(){
    wx.navigateBack({
      complete: (res) => {},
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var obj = {
      title: this.data.weather.location.city + this.data.weather.location.district + '天气怎么样，快看看~',
      path: 'pages/index/index?op=weather',
      imageUrl: this.data.weather.current.thumb,
      success: function(res) {},
      fail: function() {}
    }
    return obj;
  }
})