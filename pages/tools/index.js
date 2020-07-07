// pages/tools/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainColor:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'tools'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        this.data.items = result.items;
        this.data.mainColor = result.init.color_primary;
        this.setData({
          mainColor: this.data.mainColor
        });
      }
    });
  },
  openWeather:function(){
    wx.navigateTo({
      url: '../tools/weather',
    });
  },
  openCalander:function(){
    wx.navigateTo({
      url: '../tools/calander',
    });
  },
  openEight:function(){
    wx.navigateTo({
      url: '../tools/eight',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})