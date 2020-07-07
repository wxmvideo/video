// graceUI/components/graceSlider.js
const _windowWidth = wx.getSystemInfoSync().windowWidth;
Component({
  properties: {
    bgColor: { type: String, value: "#F6F7F8" },
    activeColor: { type: String, value: "#3688FF" },
    width: { type: Number, value: 750 },
    height: { type: Number, value: 2 },
    blockBgColor: { type: String, value: "#FFFFFF" },
    blockSize: { type: Number, value: 30 },
    min: { type: Number, value: 0 },
    minDefault: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    maxDefault: { type: Number, value: 100 }
  },
  data: {
    realWidth: 200,
    realMax: 200,
    xMin: 0,
    left1: 0,
    xMax: 100,
    currentBlock: '',
    minValue: 0,
    maxValue: 100,
    activeWidth: 0,
    activeLeft: 0
  },
  methods: {
    px2upx: function (px) {
      return (750 / _windowWidth) * px;
    },
    upx2px: function (upx) {
      return (_windowWidth / 750) * upx;
    },
    setSlider: function () {
      this.data.xMin        = (this.data.minDefault - this.data.min) / (this.data.max - this.data.min) * this.data.realMax;
      this.data.xMax        = (this.data.maxDefault - this.data.min) / (this.data.max - this.data.min) * this.data.realMax;
      this.data.minValue    = this.data.minDefault;
      this.data.maxValue    = this.data.maxDefault;
      this.data.activeLeft  = this.data.xMin + 5;
      this.data.activeWidth = this.data.xMax - this.data.xMin;
      this.setData({
        xMin :this.data.xMin,
        xMax: this.data.xMax,
        minValue: this.data.minValue,
        maxValue: this.data.maxValue,
        activeLeft: this.data.activeLeft,
        activeWidth: this.data.activeWidth
      });
    },
    touchstart: function (e) {
      this.data.currentBlock = e.target.dataset.tag;
      if (this.data.currentBlock == 'min') {
        var pageX = e.pageX || e.changedTouches[0].pageX;
        pageX = pageX - this.data.left1;
        this.data.xMin = pageX;
      } else {
        var pageX = e.pageX || e.changedTouches[0].pageX;
        pageX = pageX - this.data.left1;
        this.data.xMax = pageX;
      }
      this.setData({
        currentBlock: this.data.currentBlock,
        xMin: this.data.xMin,
        xMax: this.data.xMax
      });
    },
    touchmove: function (e) {
      this.calculate(e);
    },
    calculate: function (e) {
      var pageX = e.pageX || e.changedTouches[0].pageX;
      pageX = pageX - this.data.left1;
      if (this.data.currentBlock == 'min') {
        var xMin = this.data.xMin + (pageX - this.data.xMin);
        // 最左侧限制
        if (xMin < 0) { xMin = 0; }
        // 最右侧限制
        if (xMin >= this.data.realMax) { xMin = this.data.realMax; }
        this.data.xMin = xMin;
        // 计算值
        var value = this.data.xMin / this.data.realMax * (this.data.max - this.data.min);
        value = parseInt(value);
        value = value + this.data.min;
        this.data.minValue = value;
      } else {
        var xMax = this.data.xMax + (pageX - this.data.xMax);
        // 最左侧限制
        if (xMax < 0) { xMax = 0; }
        // 最右侧限制
        if (xMax >= this.data.realMax) { xMax = this.data.realMax; }
        this.data.xMax = xMax;
        // 计算值
        var value = this.data.xMax / this.data.realMax * (this.data.max - this.data.min);
        value = parseInt(value);
        value = value + this.data.min;
        this.data.maxValue = value;
      }
      this.setData({
        currentBlock : this.data.currentBlock,
        xMin: this.data.xMin,
        xMax: this.data.xMax,
        minValue: this.data.minValue,
        maxValue: this.data.maxValue
      });
      // 获得2个值并传递出去
      if (this.data.maxValue >= this.data.minValue) {
        this.triggerEvent('change', [this.data.minValue, this.data.maxValue]);
      } else {
        this.triggerEvent('change', [this.data.maxValue, this.data.minValue]);
      }
    }
  },
  ready: function () {
    this.data.realWidth = this.upx2px(this.data.width);
    this.data.left1 = (_windowWidth - this.data.realWidth) / 2;
    this.data.realMax = this.data.realWidth - this.data.blockSize;
    this.setData({
      realWidth : this.data.realWidth,
      realMax : this.data.realMax,
      left1 : this.data.left1
    });
    this.setSlider();
  }
})