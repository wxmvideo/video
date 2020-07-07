// graceUI/components/gracePage.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    customHeader: {
      type: Boolean,
      value: true
    },
    headerHeight: {
      type: Number,
      value: 44
    },
    headerIndex: {
      type: Number,
      value: 999
    },
    headerBG: {
      type: String,
      value: 'none'
    },
    statusBarBG: {
      type: String,
      value: 'none'
    },
    footerIndex: {
      type: Number,
      value: 999
    },
    rbWidth: { type: Number, value: 100 },
    rbBottom: { type: Number, value: 100 },
    rbRight: { type: Number, value: 20 },
    footerBg: { type: String, value: '' },
    isSwitchPage: { type: Boolean, value: false },
  },
  data: {
    statusBarHeight: 0,
    iphoneXButtomHeight: 0,
    BoundingWidth: '0px'
  },
  ready: function(){
    try {
      var res = wx.getSystemInfoSync();
      res.model = res.model.replace(' ', '');
      res.model = res.model.toLowerCase();
      if (res.model.indexOf('iphonex') != -1 || res.model.indexOf('iphone11') != -1) {
        this.setData({ iphoneXButtomHeight : 50 * (res.windowWidth / 750)});
      }
      if(!this.data.customHeader){return null;}
      this.setData({ statusBarHeight : res.statusBarHeight });
      // 小程序胶囊按钮
      var res = wx.getMenuButtonBoundingClientRect();
      this.setData({ BoundingWidth: (res.width + 20 )+ 'px' });
    } catch (e) {
      return null;
    }
  }
})
