// pages/tools/calander.js
var graceDate = require("../../graceUI/jsTools/date.js");
// 起始日期, 格式 2019-08-01
// 例如今天
var startDay = getNowFormatDate();
// 区间天数
var timeRegion = 14;
// 获取当天时间
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

// 区间天数转换为一个数组
var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
var dateList = [];
var todayTimer = graceDate.dateTimeToTimeStamp(startDay + ' 01:01:00');
for (let i = 0; i < timeRegion; i++) {
  var timeStamp = todayTimer + (i * 3600 * 24);
  var obj = {};
  obj.day = graceDate.formatDateTime(timeStamp, 'str').substring(5, 10);
  var date = new Date();
  date.setTime(timeStamp * 1000);
  obj.week = weekday[date.getDay()];
  obj.date =  date.getFullYear() + '-' + obj.day;
  dateList.push(obj);
}
var app = getApp();
var WechatSI = requirePlugin("WechatSI");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: dateList,
    currentIndex: 0,
    dateData:null,
    hourData:{},
    cnHours:['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'],
    shareData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.changeDay(0);
  },

  changeDay: function (e) {
    var index = 0;
    if(e){
      index = e.currentTarget.dataset.index;
    }
    var selectedDay = this.data.dateList[index];
    this.setData({currentIndex : index});
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'calander'
    });
    wx.request({
      url: url,
      method: 'GET',
      data:{date:selectedDay.date},
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        this.data.dateData = result.calander.data.date;
        this.data.hourData =  result.calander.data.hour;
        this.data.shareData = result.calander.data.share;
        this.setData({
          dateData :this.data.dateData,
          hourData: this.data.hourData,
          shareData:this.data.shareData
        });

        if(index == 0){
          this.playVoice();
        }
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
  },
  playVoice:function(){
    WechatSI.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: '今天是农历：' + this.data.dateData.yinli,
      success: function(res) {
        var bgAudioMannager = wx.getBackgroundAudioManager();
        bgAudioMannager.title = '日期播报';
        bgAudioMannager.singer = '暂无';
        bgAudioMannager.coverImgUrl = '';
        bgAudioMannager.src = res.filename;
        bgAudioMannager.play();
      },
      fail: function(res) {
        uni.showToast({
          duration:1500,
          title: "语音播报失败"
        });
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:function(){
    var obj = {
      title: this.data.shareData.title,
      path: 'pages/index/index?op=calander',
      imageUrl: this.data.shareData.thumb,
      success: function(res) {},
      fail: function() {}
    }
    return obj;
  },
  backIndex: function() {
    wx.navigateBack({
      delta: 99999
    });
  },
})