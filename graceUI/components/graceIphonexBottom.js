Component({
  properties: {
    bgcolor: {
      type: String,
      value: '#FFFFFF'
    },
    isFixed: {
      type: Boolean,
      value: true
    }
  },
  data: {
    height: '0rpx'
  },
  ready : function(){
    var _self = this;
    wx.getSystemInfo({
      success: function (res) {
        var model = res.model.replace(' ', '');
        if (model.search('iPhoneX') != -1) {
          _self.setData({height : '50rpx'});
        }
      }
    });
  }
})
