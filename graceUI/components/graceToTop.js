// graceUI/components/graceToTop.js
Component({
  properties: {
    top: {
      type: Number,
      value: 0
    },
    color: {
      type: String,
      value: "#3688FF"
    },
    bottom: {
      type: String,
      value: "80rpx"
    },
    background: {
      type: String,
      value: "#FFFFFF"
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    totop: function () {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }
  }
})
