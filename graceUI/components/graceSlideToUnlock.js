// graceUI/components/graceSlideToUnlock.js
Component({
  properties: {
    width: { type: Number, value: 700 },
    padding: { type: Number, value: 6 },
    size: { type: Number, value: 60 },
    bgColor: { type: String, value: '#F6F7F8' },
    blockColor: { type: String, value: '#3688FF' },
    blockActiveColor: { type: String, value: '#1ab16c' },
    iconSize: { type: String, value: '30rpx' },
    iconColor: { type: String, value: '#FFFFFF' },
    borderRadius: { type: String, value: '6rpx' },
    msg: { type: String, value: '请向右滑动滑块解锁' },
    msgUnlock: { type: String, value: '解锁成功' }
  },
  data: {
    maxWidth: 300,
    moveX: 0,
    disabled: false
  },
  methods: {
    change: function (e) {
      if (this.data.disabled) { return; }
      if (e.detail.x >= this.data.maxWidth) {
        this.setData({
          moveX : this.data.width,
          disabled : true
        });
        this.triggerEvent('unlock');
      }
    }
  },
  ready:function(){
    try {
      var res = wx.getSystemInfoSync();
      var rpx2px = res.windowWidth / 750;
      this.setData({ maxWidth: (this.data.width - this.data.padding * 2 - this.data.size - 2) * rpx2px});
    } catch (e) {
      return null;
    }
  }
})
