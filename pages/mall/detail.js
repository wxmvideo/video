// pages/mall/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品ID
    itemId: 0,
    // 商品信息
    product: null,
    // 优惠信息
    coupon: {
      color: '#9F6DFA',
      ltBg: "#F5F5F5",
      height: '180rpx',
      unit: "￥",
      number: 0,
      txt: "满0元可用",
      title: "本商品专用券",
      desc: "有效期至2018-05-20",
      btn: "领取",
    },
    prom: {},
    graceSkeleton: true,
    top: 0
  },
  onLoad: function (options) {
    this.data.itemId = options.id;
    this.setData({
      itemId: this.data.itemId
    });
  },
  openGoods: function () {
    wx.navigateToMiniProgram({
      appId: this.data.prom.appid,
      path: this.data.prom.path,
      success(res) {
        // 打开成功
      }
    });
  },
  // 分享商品
  onShareAppMessage: function (option) {
    var obj = {
      title: this.data.product.title,
      path: 'pages/index/index?gid=' + this.data.itemId,
      imageUrl: this.data.product.thumb,
      success: function (res) { },
      fail: function () { }
    }
    return obj;
  },
  onReady: function () {
    var url = app.util.url('entry/wxapp/api', {
      m: 'dk_video',
      k: 'mall',
      o: 'detail',
      id: this.data.itemId
    });
    wx.request({
      url: url,
      method: 'GET',
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        setTimeout(() => {
          this.data.product = result.product;
          this.data.prom = result.prom;
          this.data.coupon.number = result.product.discount;

          if (result.product.coupon_amount > result.product.price) {
            this.data.coupon.txt = "满" + result.product.coupon_amount + "元可用"
          } else {
            this.data.coupon.txt = "下单即用"
          }
          this.data.coupon.desc = "有效期至" + result.product.coupon_end;
          this.data.graceSkeleton = false;
          this.setData({
            product: this.data.product,
            prom: this.data.prom,
            coupon: this.data.coupon,
            graceSkeleton: this.data.graceSkeleton
          });
        }, 500);
      }
    });

  }
})