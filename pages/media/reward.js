// pages/media/reward.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'reward'
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        console.log(result.items);
        this.data.list = result.items;
        this.setData({
          list: this.data.list
        });


      }
    });
  },
  doReward: function (result) {
    var price = result.target.dataset.price;
    app.util.getUserInfo(function(userInfo){
      var url = app.util.url('entry/wxapp/pay', {
        price: price,
        m: 'dk_video'
      });

      app.util.request({
        url: 'entry/wxapp/pay', //调用wxapp.php中的doPagePay方法获取支付参数
        data: {
          price: price,
          m: 'dk_video'
        },
        'cachetime': '0',
        success(res) {
          if (res.data && res.data.data && !res.data.errno) {
            //发起支付
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function(res) {
                wx.showModal({
                  title: '系统提示',
                  content: '感谢您的支持',
                  showCancel: false,
                });
              },
              'fail': function(res) {
                wx.showModal({
                  title: '系统提示',
                  content: '打赏失败',
                  showCancel: false,
                });
              }
            });
          }
        },
        fail(res) {
          wx.showModal({
            title: '系统提示',
            content: res.data.message ? res.data.message : '错误',
            showCancel: false,
            success: function(res) {}
          });
        }
      });
    },result.detail);
  },
  goBack:function(){
    wx.navigateBack({
      delta:1
    });
  }
})