// graceUI/components/graceSearch.js
Component({
  properties: {
    height: { type: String, value: '60rpx' },
    background: { type: String, value: '#FFFFFF' },
    fontSize: { type: String, value: '28rpx' },
    iconWidth: { type: String, value: '60rpx' },
    iconColor: { type: String, value: '#A5A7B2' },
    iconFontSize: { type: String, value: '30rpx' },
    inputHeight: { type: String, value: '30rpx' },
    inputFontSize: { type: String, value: '26rpx' },
    placeholder: { type: String, value: '关键字' },
    kwd: { type: String, value: '' }
  },
  methods: {
    clearKwd: function () {
      this.setData({ kwd: '' });
      this.triggerEvent('clear', '');
    },
    inputting: function (e) {
      this.setData({ kwd: e.detail.value});
      this.triggerEvent('inputting', e.detail.value);
    },
    confirm: function (e) {
      this.triggerEvent('confirm', e.detail.value);
    }
  }
})
