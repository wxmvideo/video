// graceUI/components/graceReload.js
Component({
  properties: {
    reloadTxt: {
      type: Array,
      value: ['松开手指开始刷新', '数据刷新中', '数据已经刷新']
    },
    reloadBgColor: {
      type: Array,
      value : ['', '', '#63D2BC']
    },
    reloadColor: {
      type: Array,
      value :['#999999', '#63D2BC', '#FFFFFF']
    },
    width: {
      type: String,
      value : '750rpx'
    },
    marginLeft: {
      type: String,
      default: '0rpx'
    }
  },
  data: {
    reloadStatus: 5,
    height: 0,
    startY: 0,
    startTime: 0
  },
  methods: {
    touchstart: function (e) {
      this.startY = e.moveY;
      this.startTime = new Date().getTime();
      this.setData({
        startY : e.moveY,
        startTime : new Date().getTime()
      });
    },
    touchmove: function (e) {
      if (this.data.scrollTop > 0) { return; }
      if (this.data.height > 0) { return; }
      // 检查时间
      var timer = new Date().getTime() - this.data.startTime;
      if (timer < 200) { return; }
      var moveY = e.moveY - this.data.startY;
      if (moveY > 100) { 
        this.setData({
          reloadStatus : 0,
          height : 100
        });
      }
    },
    touchend: function (e) {
      if (this.data.height > 80) {
        this.setData({reloadStatus: 1});
        this.triggerEvent('reload');
      } else {
        this.setData({ reloadStatus: 5, height:0});
      }
    },
    endReload: function () {
      this.setData({ reloadStatus: 2 });
      setTimeout(() => {
        this.setData({ reloadStatus: 5, height : 0 });
      }, 1000)
    }
  }
})
