// graceUI/components/countdown.js
Component({
	properties: {
		bgrColor: {
			type: String,
			value: "#FFFFFF"
		},
		borderColor:{
			type:String,
			value : "#000000"
		},
		fontColor: {
			type: String,
			value: "#000000"
		},
		splitorColor: {
			type: String,
			value: "#000000"
		},
		timer:{
			type:String,
			value:""
		},
    fontSize: {
      type: String,
      value: "22rpx"
    },
    width: {
      type: String,
      value: "40rpx"
    },
    splitorText: {
      type: Array,
      value: [':', ':', ':', '']
    }
  },
	data: {
    d: 0,
    h: "",
    i: "",
    s: "",
    leftTime: 0,
    outTimer: null
  },
	ready: function(){
    this.runbase();
	},
  methods:{
    runbase : function () {
      var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
      var res = this.data.timer.match(reg);
      if (res == null) { this.setData({ outTimer: setTimeout(() => { this.runbase(); }, 1000) }); return false; }
      var year = parseInt(res[1]);
      if (year < 1000) { return false; }
      var month = parseInt(res[2]);
      var day = parseInt(res[3]);
      var h = parseInt(res[4]);
      if (h < 0 || h > 24) { return false; }
      var i = parseInt(res[5]);
      if (i < 0 || i > 60) { return false; }
      var s = parseInt(res[6]);
      if (s < 0 || s > 60) { return false; }
      var leftTime = new Date(year, month - 1, day, h, i, s);
      this.setData({ leftTime : leftTime });
      clearTimeout(this.data.outTimer);
      this.countDown();
    },
    countDown: function () {
      var leftTime = this.data.leftTime - new Date();
      if (leftTime > 0) {
        var day = parseInt(leftTime / (1000 * 60 * 60 * 24));
        var hours = parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((leftTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((leftTime % (1000 * 60)) / 1000);
        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }
        this.setData({ h: hours, i: minutes, s: seconds, d: day });
        this.setData({ outTimer: setTimeout(() => { this.countDown(); }, 1000)});
      } else {
        this.setData({ h: '00', i: '00', s: '00', d: 0 });
        this.triggerEvent('endDo');
      }
    }
  }
})
