// graceUI/components/graceLoading.js
Component({
	properties: {
		loadingType: {
			type  : Number,
			value : 0
		},
		loadingText : {
			type  : Array,
      value : ["上拉加载更多", "正在努力加载", "已经加载全部数据", '', '']
		},
    show : {
      type : Boolean,
      value : true
    },
    iconColor: {
      type: String,
      value: "#888888"
    },
    textColor: {
      type: String,
      value: "#888888"
    }
	}
});